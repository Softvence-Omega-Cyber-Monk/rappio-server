import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationController } from './notification.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [AuthModule,PrismaModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway],
  exports: [NotificationService],
})
export class NotificationModule {}
// import { Module } from '@nestjs/common';
// import { NotificationService } from './notification.service';
// import { NotificationGateway } from './notification.gateway';
// import { NotificationController } from './notification.controller';
// import { AuthModule } from '../auth/auth.module';
// import { WsAuthGuard } from '../auth/guards/ws-auth.guard';
// import { APP_GUARD } from '@nestjs/core'; // 👈 1. Import APP_GUARD
//
// @Module({
//   imports: [AuthModule],
//   controllers: [NotificationController],
//   providers: [
//     NotificationService,
//     NotificationGateway,
//     // 2. CRITICAL FIX: Use APP_GUARD token to register the WsAuthGuard
//     {
//       provide: APP_GUARD,
//       useClass: WsAuthGuard,
//     },
//     // Note: You do NOT need WsAuthGuard in the simple providers array anymore.
//   ],
// })
// export class NotificationModule {}