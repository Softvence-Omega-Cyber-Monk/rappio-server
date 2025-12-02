import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({ data: dto });
  }

  async findAll(userId?: string) {
    // if (!userId) {
    //   throw new BadRequestException('ID is required');
    // }
    return this.prisma.notification.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException(`Notification with ID ${id} not found`);
    return notification;
  }

  async update(id: string, dto: UpdateNotificationDto) {
     // Ensure exists
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    return this.prisma.notification.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
     // Ensure exists
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    return this.prisma.notification.delete({ where: { id } });
  }
}
