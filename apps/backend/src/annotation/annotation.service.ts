import { Injectable } from '@nestjs/common';
import { CoreGateway } from '../websocket/core.gateway';

@Injectable()
export class AnnotationService {
  constructor(private readonly core: CoreGateway) {}

  broadcastTags(videoId: string, tags: any[]) {
    this.core.server.clients.forEach(
      (client: WebSocket & { room?: string }) => {
        if (client.readyState === WebSocket.OPEN && client.room === videoId) {
          client.send(JSON.stringify({ event: 'tags', data: tags }));
        }
      },
    );
  }
}
