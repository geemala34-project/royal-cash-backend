import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {

  private transporter;

constructor() {

console.log("MAIL USER:", process.env.MAIL_USER);
console.log("MAIL PASSWORD EXISTS:", !!process.env.MAIL_PASSWORD);


this.transporter = nodemailer.createTransport({

  host: "smtp.gmail.com",

  port: 587,

  secure: false,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },

  tls: {
    rejectUnauthorized:false,
  },

});

}



  async sendResetPasswordEmail(
    email: string,
    token: string,
  ) {

    const resetLink =
      `http://127.0.0.1:5500/reset-password.html?token=${token}`;


    console.log("RESET LINK:", resetLink);


    await this.transporter.sendMail({

      from: 'Royal Cash <Support.royalcash@gmail.com>',

      to: email,

      subject: 'Reset Your Royal Cash Password',

      html: `

        <h2>Royal Cash Password Reset</h2>

        <p>You requested to reset your password.</p>

        <p>Click the link below to create a new password:</p>

        <a href="${resetLink}">
          Reset Password
        </a>

        <p>This link will expire soon.</p>

        <br>

        <p>Royal Cash Team</p>

      `

    });

  }




  async sendVerificationOtp(
    email: string,
    otp: string,
  ) {


    await this.transporter.sendMail({

      from: 'Royal Cash <Support.royalcash@gmail.com>',

      to: email,

      subject: 'Verify Your Royal Cash Account',

      html: `

        <h2>Royal Cash Email Verification</h2>

        <p>Thank you for creating your Royal Cash account.</p>

        <p>Your verification code is:</p>

        <h1>${otp}</h1>

        <p>This code will expire in 10 minutes.</p>

        <br>

        <p>Royal Cash Team</p>

      `

    });

  }


}
