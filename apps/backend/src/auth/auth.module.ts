import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN');

        if(!secret){
          throw new Error("JWT_SECRET is not defined in the environment variables")
        }

        if(!expiresIn){
          throw new Error("JWT_ACCESS_TOKEN_EXPIRATION is not defined in the environment variables")
        }
        
        return {
          secret,
          signOptions: { expiresIn: expiresIn as any }
        };
      },
      inject:[ConfigService]
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy, JwtRefreshStrategy],
  exports:[AuthService, JwtModule]
})
export class AuthModule {}
