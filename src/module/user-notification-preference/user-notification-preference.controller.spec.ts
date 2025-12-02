import { Test, TestingModule } from '@nestjs/testing';
import { UserNotificationPreferenceController } from './user-notification-preference.controller';
import { UserNotificationPreferenceService } from './user-notification-preference.service';

describe('UserNotificationPreferenceController', () => {
  let controller: UserNotificationPreferenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserNotificationPreferenceController],
      providers: [UserNotificationPreferenceService],
    }).compile();

    controller = module.get<UserNotificationPreferenceController>(UserNotificationPreferenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
