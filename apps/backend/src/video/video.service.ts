import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  async create(url: string) {
    return this.prisma.video.create({
      data: { url },
    });
  }

  async findAll() {
    return this.prisma.video.findMany();
  }

  async findOne(id: string) {
    return this.prisma.video.findUnique({ where: { id } });
  }

  async getResults(id: string) {
    const transcripts = await this.prisma.transcript.findMany({
      where: { videoId: id },
    });
    const tags = await this.prisma.tag.findMany({ where: { videoId: id } });
    return { transcripts, tags };
  }

  async createTranscript(videoId: string, text: string, words: any[]) {
    return this.prisma.transcript.create({ data: { videoId, text, words } });
  }
  async updateVideoStatus(id: string, status: string) {
    return this.prisma.video.update({ where: { id }, data: { status } });
  }
}
