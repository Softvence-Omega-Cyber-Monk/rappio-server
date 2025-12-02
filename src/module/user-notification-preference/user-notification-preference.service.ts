import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserNotificationPreferenceDto } from './dto/create-user-notification-preference.dto';
import { UpdateUserNotificationPreferenceDto } from './dto/update-user-notification-preference.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserNotificationPreferenceService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateUserNotificationPreferenceDto) {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    if (!dto.channelLive && !dto.newVideoUpload && !dto.platformAnnounce) {
      throw new BadRequestException(
        'At least one notification preference must be true.'
      );
    }
    return this.prisma.userNotificationPreference.create({
      data: { userId, ...dto },
    });
  }

  findAll() {
    return this.prisma.userNotificationPreference.findMany();
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    const preference = await this.prisma.userNotificationPreference.findUnique({ where: { id: id } });
    if (!preference) throw new NotFoundException(`UserNotificationPreference with ID ${id} not found`);
    return preference;
  }


  async update(id: string, dto: UpdateUserNotificationPreferenceDto) {
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    if (!dto.channelLive && !dto.newVideoUpload && !dto.platformAnnounce) {
      throw new BadRequestException(
        'At least one notification preference must be true.'
      );
    }

    const preference = await this.prisma.userNotificationPreference.findUnique({ where: { id } });
    if (!preference) throw new NotFoundException(`UserNotificationPreference with ID ${id} not found`);
    return this.prisma.userNotificationPreference.update({
      where: { id },
      data: dto,
    });
  }


  async remove(id: string) {
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    const preference = await this.prisma.userNotificationPreference.findUnique({ where: { id } });
    if (!preference) throw new NotFoundException(`UserNotificationPreference with ID ${id} not found`);
    return this.prisma.userNotificationPreference.delete({ where: { id } });
  }
}
