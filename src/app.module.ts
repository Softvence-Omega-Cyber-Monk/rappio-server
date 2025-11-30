import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { MailModule } from './module/mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { FollowModule } from './module/follow/follow.module';
import { ChannelModule } from './module/channel/channel.module';
import { ContentModule } from './module/content/content.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,      // makes ConfigService available everywhere
      envFilePath: '.env', // optional, default is .env
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('SMTP_HOST'),
          port: Number(config.get<string>('SMTP_PORT') || 587),
          secure: Number(config.get<string>('SMTP_PORT') || 587) === 465,
          auth: {
            user: config.get<string>('SMTP_USER'),
            pass: config.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: config.get<string>('SMTP_FROM') || config.get<string>('SMTP_USER') || 'SoftVence Newsletter <noreply@softvence.com>',
        },
      }),
    }),
      PrismaModule,
      UserModule,
      AuthModule,
      MailModule,
      FollowModule,
      ChannelModule,
      ContentModule,
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
