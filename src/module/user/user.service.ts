import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { safeUserSelect } from './dto/safeUserSelect';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMyProfileDto } from './dto/update-myprofile-dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({select: {
        ...safeUserSelect,
      },});
    return users;
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(id: string) {
    const isUser=await this.prisma.user.findUnique({ where: { id: id } });
    if (!isUser) {
      throw new NotFoundException('User with this ID Not exists.');
    }
    return this.prisma.user.findUnique({ where: { id },select: {...safeUserSelect,} });
  }

  async update(id: string, dto: UpdateUserDto) {
    // check if user exists
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    const updateData = {
      ...dto,
        ...(dto.email && { email: dto.email }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.firstName && { firstName: dto.firstName }),
        ...(dto.lastName && { lastName: dto.lastName }),

    };
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No valid fields provided for update');
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async myProfile(id: string, dto: UpdateMyProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    const updateData = {
      ...(dto.email && { email: dto.email }),
      ...(dto.phone && { phone: dto.phone }),
      ...(dto.firstName && { firstName: dto.firstName }),
      ...(dto.lastName && { lastName: dto.lastName }),
    };
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No valid fields provided for update');
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    const isExists = await this.prisma.user.findUnique({
      where: { id }
    });
    if (!isExists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.prisma.user.delete({where: { id:id }});
  }


}
