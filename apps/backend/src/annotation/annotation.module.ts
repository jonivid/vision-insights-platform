import { Module } from '@nestjs/common';
import { AnnotationService } from './annotation.service';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  providers: [AnnotationService],
  exports: [AnnotationService],
})
export class AnnotationModule {}
