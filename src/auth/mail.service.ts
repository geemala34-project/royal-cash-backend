import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {

  private resend: Resend;

  constructor() {

    this.resend = new Resend(
      process.env.RESEND_API_KEY,
    );

    console.log(
      'RESEND API KEY EXISTS:',
      !!process.env.RESEND_API_KEY,
    );
  }

  async sendVerificationOtp(
    email: string,
    otp: string,
  ) {

    const { data, error } =
      await this.resend.emails.send({

        from: 'Royal Cash <onboarding@resend.dev>',

        to: [email],

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

    if (error) {

      console.error(
        'RESEND OTP ERROR:',
        error,
      );

      throw new Error(
        'Unable to send verification email',
      );
    }

    console.log(
      'OTP EMAIL SENT:',
      data?.id,
    );
  }

  async sendResetPasswordEmail(
    email: string,
    token: string,
  ) {

    const resetLink =
      `https://royal-cash-tau.vercel.app/reset-password.html?token=${token}`;

    const { data, error } =
      await this.resend.emails.send({

        from: 'Royal Cash <onboarding@resend.dev>',

        to: [email],

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

    if (error) {

      console.error(
        'RESEND RESET EMAIL ERROR:',
        error,
      );

      throw new Error(
        'Unable to send password reset email',
      );
    }

    console.log(
      'RESET EMAIL SENT:',
      data?.id,
    );
  }
}
