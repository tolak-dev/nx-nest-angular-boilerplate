import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const sgMail = require('@sendgrid/mail');

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly configService: ConfigService) {
    const sendgridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!sendgridApiKey) {
      throw new Error(
        'SENDGRID_API_KEY is not defined in environment variables.'
      );
    }
    sgMail.setApiKey(process.env?.['SENDGRID_API_KEY'] || '');
  }

  async sendResetPasswordEmail(
    email: string,
    resetToken: string
  ): Promise<void> {
    const resetUrl = this.buildResetUrl(resetToken);
    const from = this.configService.get<string>(
      'EMAIL_FROM',
      'noreply@yourapp.com'
    );
    const appName = this.configService.get<string>(
      'SENDGRID_EMAIL_APP_NAME',
      'My awesome app'
    );

    const msg = {
      to: email,
      from: {
        email: from,
        name: appName,
      },
      subject: 'Password Reset Request',
      html: this.getResetPasswordEmailTemplate(resetUrl),
      text: this.getResetPasswordEmailTextVersion(resetUrl),
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send reset email to ${email}`, error);
      throw new Error('Failed to send password reset email');
    }
  }

  private buildResetUrl(token: string): string {
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:4200'
    );
    return `${frontendUrl}/reset-password?token=${token}`;
  }

  private getResetPasswordEmailTemplate(resetUrl: string): string {
    return `<p>Click the link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`;
  }

  private getResetPasswordEmailTextVersion(resetUrl: string): string {
    return `Reset your password using this link: ${resetUrl}`;
  }
}
