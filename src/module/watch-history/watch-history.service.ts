import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWatchHistoryDto } from './dto/create-watch-history.dto';
import { UpdateWatchHistoryDto } from './dto/update-watch-history.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryWatchHistoryDto } from './dto/query-watch-history.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WatchHistoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWatchHistoryDto) {
    const { userId, contentId, progressSeconds } = dto;

    // upsert using composite unique (userId, contentId)
    const record = await this.prisma.watchHistory.upsert({
      where: { userId_contentId: { userId, contentId } }, // generated unique name by Prisma from @@unique([...])
      create: {
        userId,
        contentId,
        progressSeconds,
      },
      update: {
        progressSeconds,
        lastWatchedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return record;
  }

  async findAll(query: QueryWatchHistoryDto) {
    const page = query.page ?? 1;
    const pageSize = Math.min(query.pageSize ?? 20, 100);
    const where: Prisma.WatchHistoryWhereInput = {};

    if (query.userId) where.userId = query.userId;
    if (query.contentId) where.contentId = query.contentId;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.watchHistory.findMany({
        where,
        orderBy: { lastWatchedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          // include minimal safe relations (hide passwords)
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          content: {
            select: {
              id: true,
              title: true,
              playbackUrl: true,
              thumbnailUrl: true,
            },
          },
        },
      }),
      this.prisma.watchHistory.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }


  async findOne(id: string) {
    const record = await this.prisma.watchHistory.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        content: {
          select: {
            id: true,
            title: true,
            playbackUrl: true,
          },
        },
      },
    });
    if (!record) throw new NotFoundException('WatchHistory not found');
    return record;
  }


  async update(id: string, dto: UpdateWatchHistoryDto) {
    // ensure exists
    const exists = await this.prisma.watchHistory.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('WatchHistory not found');

    // Build update payload only with provided fields
    const data: Prisma.WatchHistoryUpdateInput = {};
    if (dto.progressSeconds !== undefined) data.progressSeconds = dto.progressSeconds;
    // update lastWatchedAt automatically when progressSeconds updated
    if (dto.progressSeconds !== undefined) data.lastWatchedAt = new Date();

    const updated = await this.prisma.watchHistory.update({
      where: { id },
      data,
    });
    return updated;
  }

  async remove(id: string) {
    // ensure exists
    const exists = await this.prisma.watchHistory.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('WatchHistory not found');

    await this.prisma.watchHistory.delete({ where: { id } });
    return { success: true };
  }
}
