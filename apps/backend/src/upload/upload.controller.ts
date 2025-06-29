// apps/api/src/upload/upload.controller.ts

import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  Inject,
  Logger,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import Redis from 'ioredis';

@Controller('videos/:id/upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(
    private readonly uploadService: UploadService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const storageKey = await this.uploadService.saveFile(id, file);
    await this.uploadService.updateVideoStatus({
      id,
      storageKey,
      status: 'processed',
    });
    await this.redis.lpush(
      'video-processing-queue',
      JSON.stringify({ videoId: id, storageKey }),
    );

    return { storageKey };
  }
  @Post('videos/:id/complete')
  complete(@Param('id') id: string, @Body('storageKey') storageKey: string) {
    return this.uploadService.updateVideoStatus({
      id,
      storageKey,
      status: 'processed',
    });
  }
}
