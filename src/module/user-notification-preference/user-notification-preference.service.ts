import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserNotificationPreferenceDto } from './dto/create-user-notification-preference.dto';
import { UpdateUserNotificationPreferenceDto } from './dto/update-user-notification-preference.dto';
import { NotificationService } from '../notification/notification.service';


@Injectable()
export class UserNotificationPreferenceService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(userId: string, dto: CreateUserNotificationPreferenceDto) {
    if (!userId) throw new BadRequestException('userId required');
    const data = await this.prisma.userNotificationPreference.create({
      data: { userId, ...dto },
    });
    // Create a notification for the user
    await this.prisma.notification.create({
      data: {
        user: { connect: { id: userId } }, // connect to the existing user
        type: "ANNOUNCEMENT",
        message: "test msg",
      },
    });
    return data
  }

  findAll() {
    return this.prisma.userNotificationPreference.findMany();
  }

  async findOne(id: string) {
    if (!id) throw new BadRequestException('id required');
    const pref = await this.prisma.userNotificationPreference.findUnique({ where: { id } });
    if (!pref) throw new NotFoundException('preference not found');
    return pref;
  }

  async update(id: string, dto: UpdateUserNotificationPreferenceDto) {
    const pref = await this.prisma.userNotificationPreference.findUnique({ where: { id } });
    if (!pref) throw new NotFoundException('preference not found');
    return this.prisma.userNotificationPreference.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const pref = await this.prisma.userNotificationPreference.findUnique({ where: { id } });
    if (!pref) throw new NotFoundException('preference not found');
    return this.prisma.userNotificationPreference.delete({ where: { id } });
  }
}
