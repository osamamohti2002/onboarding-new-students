import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin(){
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@CurrentUser() user: any){
    const validatedUser = await this.authService.validateGoogleUser(user);
    return this.authService.generateToken(validatedUser)
  }
}
