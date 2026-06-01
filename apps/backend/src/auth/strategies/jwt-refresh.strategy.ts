import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { Request } from 'express'; 



@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(private readonly configService: ConfigService, private readonly prisma: PrismaService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET')!,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any){
        const refreshToken = req.headers['authorization']?.split(' ')[1];

        if(!refreshToken){
            throw new UnauthorizedException('NO refresh token provided')
        }

        const storedToken = await this.prisma.refreshToken.findFirst({
            where:{
                userId: payload.sub,
            }
        });

        if(!storedToken){
            throw new BadRequestException("Refresh token not found in database!")
        }

        const isTokenValid = await bcrypt.compare(refreshToken, storedToken.token)

        if(!isTokenValid){
            throw new UnauthorizedException('Invalid token!')
        }

        if(storedToken.expiresAt < new Date()){
            await this.prisma.refreshToken.delete({
                where: { id: storedToken.id }
            })
            throw new BadRequestException("Refresh token has expired!")
        }

        return { userId: payload.sub, refreshToken: refreshToken, ...payload,};

    }
    
}