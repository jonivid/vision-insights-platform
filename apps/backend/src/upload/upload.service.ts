import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { join } from 'path';
import { promises as fs } from 'fs';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private prisma: PrismaService,
    @Inject('S3_CLIENT') private readonly s3: S3Client,
    private readonly config: ConfigService,
  ) {}
  async saveFile(videoId: string, file: Express.Multer.File): Promise<string> {
    const bucket = this.config.get<string>('S3_BUCKET');
    const key = `${videoId}/${Date.now()}_${encodeURIComponent(file.originalname)}`;

    this.logger.log(`PUT ${bucket}/${key}`);
    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    this.logger.log(`Uploaded to ${bucket}/${key}`);
    return key;
  }
  // async saveFile(videoId: string, file: Express.Multer.File) {
  //   const dir = join(process.cwd(), 'uploads', videoId);
  //   await fs.mkdir(dir, { recursive: true });

  //   const filepath = join(dir, file.originalname);
  //   await fs.writeFile(filepath, file.buffer);

  //   const storageKey = `uploads/${videoId}/${file.originalname}`;
  //   // Use new helper:
  //   await this.prisma.updateVideo(videoId, {
  //     storageKey,
  //     status: 'uploaded',
  //   });

  //   return storageKey;
  // }

  async updateVideoStatus({
    id,
    storageKey,
    status,
  }: {
    id: string;
    storageKey: string;
    status: string;
  }) {
    await this.prisma.updateVideo(id, {
      storageKey,
      status,
    });
  }
  async updateProgress(videoId: string, percent: number) {
    // Use helper here too:
    await this.prisma.updateVideo(videoId, {
      uploadProgress: percent,
    });
  }
}
