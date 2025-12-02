import { Module } from '@nestjs/common';
import { UserNotificationPreferenceService } from './user-notification-preference.service';
import { UserNotificationPreferenceController } from './user-notification-preference.controller';

@Module({
  controllers: [UserNotificationPreferenceController],
  providers: [UserNotificationPreferenceService],
})
export class UserNotificationPreferenceModule {}
