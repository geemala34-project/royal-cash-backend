
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

  private async sendEmail(to: string, subject: string, html: string) {

    const response = await fetch(process.env.APPS_SCRIPT_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.APPS_SCRIPT_SECRET,
        to,
        subject,
        html,
      }),
    });

    const text = await response.text();
    if (text !== 'ok') {
      throw new Error(`Email send failed: ${text}`);
    }
  }


  async sendVerificationOtp(email: string, otp: string) {

    await this.sendEmail(
      email,
      'Verify Your Royal Cash Account',
      `
        <h2>Royal Cash</h2>
        <h3>Verify Your Email</h3>
        <p>Your verification code is:</p>
        <h1>${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>Royal Cash Team</p>
      `,
    );

  }


  async sendResetPasswordEmail(email: string, token: string) {

    const resetLink =
`https://royal-cash-lemon.vercel.app/reset-password.html?token=${token}`;

    await this.sendEmail(
      email,
      'Reset Your Royal Cash Password',
      `
        <h2>Royal Cash Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>
          <a href="${resetLink}">
            Reset Password
          </a>
        </p>
        <p>Royal Cash Team</p>
      `,
    );

  }

}
