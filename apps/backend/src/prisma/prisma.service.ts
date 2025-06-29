// apps/backend/src/prisma/prisma.service.ts

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly retryDelay = 5000; // milliseconds

  async onModuleInit() {
    // kick off the first connection attempt, but don’t await it
    this.tryConnect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from database');
  }

  /**
   * Attempt to connect, and on failure schedule another try.
   */
  private async tryConnect(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('✅ Connected to database');
    } catch (error) {
      this.logger.error(
        `❌ Database connection failed, retrying in ${this.retryDelay}ms`,
        (error as Error).message,
      );
      // schedule the next retry
      setTimeout(() => this.tryConnect(), this.retryDelay);
    }
  }

  // wrap your queries to catch runtime errors too:
  async updateVideo(id: string, data: Prisma.VideoUpdateInput) {
    try {
      return await this.video.update({ where: { id }, data });
    } catch (error) {
      this.logger.error(`Error updating video ${id}`, (error as Error).message);
      throw error; // or throw a custom HttpException if you prefer
    }
  }

  async findVideoById(id: string) {
    try {
      return await this.video.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(`Error finding video ${id}`, (error as Error).message);
      throw error;
    }
  }
}
