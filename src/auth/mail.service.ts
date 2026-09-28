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
          <div style="
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: auto;
            padding: 30px;
            text-align: center;
          ">

            <h2 style="color:#7b00ff;">
              Royal Cash
            </h2>

            <h2>
              Verify Your Email
            </h2>

            <p>
              Thank you for creating your Royal Cash account.
            </p>

            <p>
              Your verification code is:
            </p>

            <h1 style="
              letter-spacing: 8px;
              color:#ff0088;
            ">
              ${otp}
            </h1>

            <p>
              This code will expire in 10 minutes.
            </p>

            <p>
              Royal Cash Team
            </p>

          </div>
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
          <div style="
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: auto;
            padding: 30px;
            text-align: center;
          ">

            <h2>
              Royal Cash Password Reset
            </h2>

            <p>
              You requested to reset your password.
            </p>

            <p>
              Click the button below to create a new password.
            </p>

            <a
              href="${resetLink}"
              style="
                display:inline-block;
                padding:12px 25px;
                background:#7b00ff;
                color:white;
                text-decoration:none;
                border-radius:8px;
              "
            >
              Reset Password
            </a>

            <p>
              This link will expire soon.
            </p>

            <p>
              Royal Cash Team
            </p>

          </div>
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
