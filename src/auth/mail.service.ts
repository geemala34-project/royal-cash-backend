
   import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { promises as dns } from 'dns';

@Injectable()
export class MailService implements OnModuleInit {

  private transporter!: nodemailer.Transporter;

  async onModuleInit() {
    // Railway par IPv6 route nahi — Gmail ka IPv4 address nikal kar direct connect
    const [gmailIp] = await dns.resolve4('smtp.gmail.com');

    this.transporter = nodemailer.createTransport({
      host: gmailIp,
      port: 465,
      secure: true,

      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },

      tls: {
        servername: 'smtp.gmail.com',
      },
    });
  }


  async sendVerificationOtp(
    email: string,
    otp: string,
  ) {

    await this.transporter.sendMail({

      from: `"Royal Cash" <${process.env.MAIL_USER}>`,

      to: email,

      subject: 'Verify Your Royal Cash Account',

      html: `
        <h2>Royal Cash</h2>
        <h3>Verify Your Email</h3>
        <p>Your verification code is:</p>
        <h1>${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>Royal Cash Team</p>
      `,
    });

  }


  async sendResetPasswordEmail(
    email: string,
    token: string,
  ) {

    const resetLink =
`https://royal-cash-lemon.vercel.app/reset-password.html?token=${token}`;

    await this.transporter.sendMail({

      from: `"Royal Cash" <${process.env.MAIL_USER}>`,

      to: email,

      subject: 'Reset Your Royal Cash Password',

      html: `
        <h2>Royal Cash Password Reset</h2>

        <p>You requested to reset your password.</p>

        <p>
          <a href="${resetLink}">
            Reset Password
          </a>
        </p>

        <p>Royal Cash Team</p>
      `,
    });

  }

}
