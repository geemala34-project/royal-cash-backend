import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {

  private transporter;

  constructor() {

   this.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

  }


  async sendResetPasswordEmail(
    email: string,
    token: string,
  ) {

    const resetLink = `http://127.0.0.1:5500/reset-password.html?token=${token}`;

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

}