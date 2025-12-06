import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LiveCommentGateway } from './liveComment.gateway';
import { CreateLiveCommentDto } from './dto/create-live-comment.dto';
import { UpdateLiveCommentDto } from './dto/update-live-comment.dto';

@Injectable()
export class LiveCommentService {
  constructor(
    private prisma: PrismaService,
    private gateway: LiveCommentGateway,
  ) {}

  // ------- GET ALL COMMENTS FOR VIDEO -------
  getAll(videoId: string) {
    return this.prisma.liveComment.findMany({
      where: { videoId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ------- CREATE COMMENT -------
  async create(userId: string, dto: CreateLiveCommentDto) {
    const comment = await this.prisma.liveComment.create({
      data: { userId, ...dto },
      include: { user: true },
    });

    // Send realtime event
    this.gateway.sendCreate(dto.videoId, comment);

    return comment;
  }

  // ------- UPDATE COMMENT -------
  async update(id: string, dto: UpdateLiveCommentDto) {
    const comment = await this.prisma.liveComment.update({
      where: { id },
      data: dto,
      include: { user: true },
    });

    this.gateway.sendUpdate(comment.videoId, comment);

    return comment;
  }

  // ------- DELETE COMMENT -------
  async remove(id: string) {
    const comment = await this.prisma.liveComment.findUnique({
      where: { id },
    });
    if (!comment) return null;

    await this.prisma.liveComment.delete({ where: { id } });

    this.gateway.sendDelete(comment.videoId, id);

    return { id };
  }
}
