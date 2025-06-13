import { Module } from '@nestjs/common';
import { NotifyController } from './notify.controller';
import { NotifyService } from './notify.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [

    MailerModule.forRoot({
      transport: {
        host: String(process.env.MAIL_HOST) || 'smtp.gmail.com',
        port: Number(process.env.MAIL_PORT) || 587,
        secure: false,
        service: 'Gmail',
        auth: {
          user: process.env.MAIL_USER || "dvc.290603@gmail.com",
          pass: process.env.MAIL_PASS || "cedp dere gnsl bwru",
        },
      },
    }),

  ],
  controllers: [NotifyController],
  providers: [NotifyService],
})
export class NotifyModule {
  
}
