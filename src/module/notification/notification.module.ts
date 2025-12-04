import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationController } from './notification.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/prisma.service';
import { FollowController } from '../follow/follow.controller';
import { FollowService } from '../follow/follow.service';

@Module({
   //imports: [AuthModule,PrismaModule],
  // controllers: [NotificationController],
  // providers: [NotificationService, NotificationGateway],
  // exports: [NotificationService],

  // providers: [NotificationService, NotificationGateway, PrismaService],
  // controllers: [NotificationController],
  // exports: [NotificationService, NotificationGateway],

  // controllers: [FollowController],
  // providers: [FollowService],
  imports: [PrismaModule,AuthModule],
  controllers: [NotificationController],
  providers: [NotificationGateway, NotificationService,PrismaService],
  exports: [NotificationGateway, NotificationService],
})
export class NotificationModule {}
