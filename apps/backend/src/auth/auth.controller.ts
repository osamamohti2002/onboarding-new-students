import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'generated/prisma';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin(){
    return;
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@CurrentUser() user: any){
    const validatedUser = await this.authService.validateGoogleUser(user);
    return this.authService.generateToken(validatedUser)
  }

  @Public()
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshToken(@CurrentUser() user: any, @Req() req: any){
    const refreshToken = req.headers.authorization.split(' ')[1];
    return this.authService.refreshToken(user.sub, refreshToken);

  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body('role') role: UserRole){
    return this.authService.updateRole(id, role)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: any) {
    return this.authService.logout(user.sub);
  }
  
}
