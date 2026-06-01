import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

interface JwtPayload{
    sub: string;
    name: string;
    email: string;
    role: string;    
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private configService: ConfigService, private prisma: PrismaService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET')!,
            ignoreExpiration: false,
        });
    }


    async validate (payload: JwtPayload){
        const user = await this.prisma.user.findUnique({
            where: {id: payload.sub},
            include:{ person: true}
        });
        if (!user) {
            throw new UnauthorizedException('Invalid Token');
        }
        return user;
    }


}