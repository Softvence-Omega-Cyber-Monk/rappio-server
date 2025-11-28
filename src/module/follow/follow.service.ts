import { Injectable ,NotFoundException,BadRequestException} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async followChannel(userId: string, channelHandle: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { handle: channelHandle },
    });

    if (!channel) throw new NotFoundException('Channel not found');

    if (channel?.ownerId === userId) {
      throw new BadRequestException('You cannot follow your own channel');
    }

    // Check if already following
    const exists = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: channel.id,
        },
      },
    });

    if (exists) {
      throw new BadRequestException('Already following this channel');
    }

    await this.prisma.follow.create({
      data: {
        followerId: userId,
        followingId: channel.id,
      },
    });

    return { message: 'Followed successfully' };
  }
  async unfollowChannel(userId: string, channelHandle: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { handle: channelHandle },
    });

    if (!channel) throw new NotFoundException('Channel not found');

    return this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: channel.id,
        },
      },
    });
  }

  async isFollowing(userId: string, channelHandle: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { handle: channelHandle },
    });

    if (!channel) throw new NotFoundException('Channel not found');

    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: channel.id,
        },
      },
    });

    return { isFollowing: !!follow };
  }

  async getFollowedChannels(userId: string) {
    return this.prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: true }, // Channel info
    });
  }

  async getFollowers(channelHandle: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { handle: channelHandle },
    });

    if (!channel) throw new NotFoundException('Channel not found');

    return this.prisma.follow.findMany({
      where: { followingId: channel.id },
      include: { follower: true },
    });
  }

  async getFollowerCount(channelId: string) {
    // Validate channel existence
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    // Count followers
    const count = await this.prisma.follow.count({
      where: { followingId: channelId },
    });

    return { followers: count };
  }
}
