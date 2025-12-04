import { Module } from '@nestjs/common';
import { UserNotificationPreferenceService } from './user-notification-preference.service';
import { UserNotificationPreferenceController } from './user-notification-preference.controller';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [UserNotificationPreferenceController],
  providers: [UserNotificationPreferenceService],
})
export class UserNotificationPreferenceModule {}
