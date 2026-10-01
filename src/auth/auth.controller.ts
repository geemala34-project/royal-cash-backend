import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { SignupDto } from './dto/signup.dto';

import { LoginDto } from './dto/login.dto';

import { AuthGuard } from '@nestjs/passport';

import type { Response } from 'express';

import { ResetPasswordDto } from './dto/reset-password.dto';

import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {


  constructor(
    private authService: AuthService,
  ) {}



  // NORMAL SIGNUP

  @Post('signup')
  signup(
    @Body() data: SignupDto,
  ) {

    return this.authService.signup(data);

  }





  // NORMAL LOGIN

  @Post('login')
  login(
    @Body() data: LoginDto,
  ) {

    return this.authService.login(
      data.email,
      data.password,
    );

  }





  // GOOGLE LOGIN START

  @Get('google')
  @UseGuards(
    AuthGuard('google'),
  )
  googleLogin() {

  }





  // GOOGLE CALLBACK

  @Get('google/callback')
  @UseGuards(
    AuthGuard('google'),
  )
  async googleCallback(
    @Req() req:any,
    @Res() res:Response,
  ) {


    const result =
      await this.authService.googleLogin(
        req.user,
      );



    // Already subscriber

    if(result.subscribed){


  return res.redirect(
`https://royal-cash-lemon.vercel.app/home.html?token=${result.accessToken}&name=${encodeURIComponent(result.user.name)}&email=${encodeURIComponent(result.user.email)}`
  );

    }





    // New Google user

return res.redirect(
`https://royal-cash-lemon.vercel.app/mid-page.html?google=true&token=${result.accessToken}&name=${encodeURIComponent(result.user.name)}&email=${encodeURIComponent(result.user.email)}`
);


  }
  
@Post('forgot-password')
async forgotPassword(
  @Body('email') email: string
) {
  return this.authService.forgotPassword(email);
}

@Post('verify-otp')
async verifyOtp(
  @Body() data:any,
) {

  return this.authService.verifyOtp(
    data.email,
    data.otp,
  );

}
  
@Post('reset-password')
async resetPassword(
  @Body() data: ResetPasswordDto,
) {

  return this.authService.resetPassword(
    data.token,
    data.newPassword,
  );

}

@Post('change-password')
async changePassword(
  @Body() data: any,
) {

  return this.authService.changePassword(
    data.email,
    data.currentPassword,
    data.newPassword,
  );

}


@Get('me')
@UseGuards(JwtGuard)
getMe(@Req() req:any) {

  return req.user;

}


}
