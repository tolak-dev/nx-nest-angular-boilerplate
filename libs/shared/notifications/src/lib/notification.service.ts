import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const sgMail = require('@sendgrid/mail');

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailOptions {
  to: string | string[];
  template: EmailTemplate;
  from?: string;
  fromName?: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly defaultFrom: string;
  private readonly defaultFromName: string;
  private readonly frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    const sendgridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!sendgridApiKey) {
      throw new Error(
        'SENDGRID_API_KEY is not defined in environment variables.'
      );
    }
    sgMail.setApiKey(process.env?.['SENDGRID_API_KEY'] || '');

    // Cache frequently used config values
    this.defaultFrom = this.configService.get<string>(
      'EMAIL_FROM',
      'noreply@yourapp.com'
    );
    this.defaultFromName = this.configService.get<string>(
      'SENDGRID_EMAIL_APP_NAME',
      'My awesome app'
    );
    this.frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'https://featstack.com'
    );
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const msg = {
      to: options.to,
      from: {
        email: options.from || this.defaultFrom,
        name: options.fromName || this.defaultFromName,
      },
      subject: options.template.subject,
      html: options.template.html,
      text: options.template.text,
    };

    try {
      await sgMail.send(msg);
      const recipients = Array.isArray(options.to)
        ? options.to.join(', ')
        : options.to;
      this.logger.log(`Email sent successfully to ${recipients}`);
    } catch (error) {
      const recipients = Array.isArray(options.to)
        ? options.to.join(', ')
        : options.to;
      this.logger.error(`Failed to send email to ${recipients}`, error);
      throw new Error('Failed to send email');
    }
  }

  async sendResetPasswordEmail(
    email: string,
    resetToken: string
  ): Promise<void> {
    const resetUrl = this.buildResetUrl(resetToken);
    const template: EmailTemplate = {
      subject: 'Password Reset Request',
      html: this.getResetPasswordEmailTemplate(resetUrl),
      text: this.getResetPasswordEmailTextVersion(resetUrl),
    };

    await this.sendEmail({ to: email, template });
  }

  async sendWelcomeEmail(email: string, userName: string): Promise<void> {
    const template: EmailTemplate = {
      subject: `Welcome to ${this.defaultFromName}!`,
      html: this.getWelcomeEmailTemplate(userName),
      text: this.getWelcomeEmailTextVersion(userName),
    };

    await this.sendEmail({ to: email, template });
  }

  async sendEmailVerification(
    email: string,
    verificationToken: string
  ): Promise<void> {
    const verificationUrl = this.buildVerificationUrl(verificationToken);
    const template: EmailTemplate = {
      subject: 'Please verify your email address',
      html: this.getEmailVerificationTemplate(verificationUrl),
      text: this.getEmailVerificationTextVersion(verificationUrl),
    };

    await this.sendEmail({ to: email, template });
  }

  // URL builders
  private buildResetUrl(token: string): string {
    return `${this.frontendUrl}/reset-password?token=${token}`;
  }

  private buildVerificationUrl(token: string): string {
    return `${this.frontendUrl}/verify-email?token=${token}`;
  }

  // Password Reset Templates
  private getResetPasswordEmailTemplate(resetUrl: string): string {
    return '<div>Test</div>';
  }

  private getResetPasswordEmailTextVersion(resetUrl: string): string {
    return '<div>Test</div>';
  }

  // Welcome Email Templates
  private getWelcomeEmailTemplate(userName: string): string {
    return '<div>Test</div>';
  }

  private getWelcomeEmailTextVersion(userName: string): string {
    return '<div>Test</div>';
  }

  // Email Verification Templates
  private getEmailVerificationTemplate(verificationUrl: string): string {
    return '<div>Test</div>';
  }

  private getEmailVerificationTextVersion(verificationUrl: string): string {
    return '<div>Test</div>';
  }
}
