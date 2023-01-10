import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

type EmailData = {
  to: string; // list of receivers
  from?: string; // sender address
  subject: string; // Subject line
  template?: string;
  context?: object;
  html?: string;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendUserRegisteredEmail(email: string, name: string) {
    const emailData: EmailData = {
      to: email,
      subject: 'Confirming successful registration!',
      html: `<b>welcome</b>`,
    };

    await this.sendEmail(emailData);
  }

  private async sendEmail(data: EmailData) {
    await this.mailerService
      .sendMail({ ...data, bcc: process.env.EMAIL_BCC_ADDRESS })
      .catch((err) => {
        this.logger.error(err || err.message);
        throw err;
      });
  }
}
