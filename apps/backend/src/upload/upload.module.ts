import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    // Only applies to this module
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: { fileSize: 100 * 1024 * 1024 }, // e.g. 100MB
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService], // if other modules need to call saveFile()
})
export class UploadModule {}
