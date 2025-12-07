import { Injectable,Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
//import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter; // let TS infer the type
  private readonly logger = new Logger(MailService.name);
  // private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  // private readonly logger = new Logger(MailService.name);
  constructor(private config: ConfigService) {

    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: Number(this.config.get('SMTP_PORT')),
      secure: Number(this.config.get('SMTP_PORT')) === 465,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
      pool: true,
      maxConnections: 5,
      connectionTimeout: 30000,
      greetingTimeout: 15000,
      socketTimeout: 30000,
      tls: { rejectUnauthorized: false },
    });

  }

  async sendMail(to: string, subject: string, html: string) {
    const data = await this.transporter.sendMail({
      from:process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
    console.log(data);
    this.logger.log(`Code sent to ${to} email.`);
  }

}
