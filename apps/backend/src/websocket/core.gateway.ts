import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import type { Server, WebSocket } from 'ws';


@WebSocketGateway({ path: '/ws' })
export class CoreGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('[WS] CoreGateway initialized');
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: WebSocket & { room?: string }
  ) {
    client.room = roomId;
    console.log(`[WS] Client joined room ${roomId}`);
  }
}