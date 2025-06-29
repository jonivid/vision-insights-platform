import { Global, Module } from '@nestjs/common';
import { CoreGateway }    from './core.gateway';

@Global()
@Module({
  providers: [CoreGateway],
  exports:   [CoreGateway],
})
export class WebsocketModule {}