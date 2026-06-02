import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'generated/prisma';
import { emitWarning } from 'process';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ){}


  async validateGoogleUser(googleUser: {googleId: string, email: string, firstName: string, lastName: string}){
    const existingUser = await this.prisma.user.findUnique({
      where:{
        googleId: googleUser.googleId,
      },include:{
        person: true
      }
    });
    
    if(existingUser){
      return existingUser;
    };

    const result = await this.prisma.$transaction(async (tx) =>{
      const person = await tx.person.upsert({
        where: {email: googleUser.email},
        update: {},
        create: {
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          email: googleUser.email,
          
        },
      });

      const user = await tx.user.create({
        data: {
          personId: person.id,
          googleId: googleUser.googleId,
          role: UserRole.OPERATOR_ONBOARDING
        },
        include: {
          person: true,
        }
      });

      return {user};
    });

    return result;
  }

  async generateToken(user: {id: string, role: string, person:{email: string}}){
    const payload = {
      sub: user.id,
      email: user.person.email,
      role: user.role
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN')
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN')
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)

    const decoded = this.jwtService.decode(refreshToken) as {exp: number};

    if(!decoded?.exp){
      throw new BadRequestException('Invalid Refresh Token');
    };
    
    const expiresAt = new Date(decoded.exp * 1000);

    await this.prisma.refreshToken.deleteMany({
      where: {
        userId: user.id,
      }
    });

    await this.prisma.refreshToken.create({
      data:{
        userId: user.id,
        token: hashedRefreshToken,
        expiresAt,
      }
    });

    return{
      accessToken,
      refreshToken,
      user:{
        id: user.id,
        email: user.person.email,
        role: user.role
      }
    };

  }

  async refreshToken(userId: string, refreshToken: string){
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include:{
        person: true,
      }
    });

    if(!currentUser){
      throw new NotFoundException('User Not Found');
    };

    const storedTokens = await this.prisma.refreshToken.findMany({
      where: {
        userId: userId,
      }
    });

    if(!storedTokens.length){
      throw new BadRequestException('Refresh token not found in database!');
    };

    let validStoredToken = null as (typeof storedTokens)[number] | null;

    for(const storedToken of storedTokens){
      const isMatch = await bcrypt.compare(refreshToken, storedToken.token);
      if(isMatch){
        validStoredToken = storedToken;
        break;
      }
    }

    if(!validStoredToken){
      throw new UnauthorizedException('Invalid refresh token');
    };
    
    if(new Date() > new Date(validStoredToken.expiresAt)){
      await this.prisma.refreshToken.delete({
        where: {
          id: validStoredToken.id,
        }
      });
      throw new BadRequestException('Refresh Token Has Expired');
    };


    const tokens = await this.generateToken(currentUser);

    return {
      message: 'Refresh Token Issued Successfully',
      tokens,
    };
    
  }

  async logout(userId: string){
    await this.prisma.refreshToken.deleteMany({
      where:{
        userId: userId,
      }
    });
    
    return {
      message: 'Logout Successful',
    };
  }

}
