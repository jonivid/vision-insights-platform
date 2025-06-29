import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { VideoModule } from './video/video.module';
import { ConfigModule } from '@nestjs/config';
import { AnnotationModule } from './annotation/annotation.module';
import { WebsocketModule } from './websocket/websocket.module';
import { BullModule } from '@nestjs/bull';
import { RedisModule } from './redis/redis.module';
import { S3Module } from './s3/s3.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // loads .env into process.env
    RedisModule.forRootAsync(),
    S3Module.forRootAsync(),
    PrismaModule,
    WebsocketModule,
    VideoModule,
    UploadModule,
    AnnotationModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'video-processing', // queue name
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
