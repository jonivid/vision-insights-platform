import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import * as compression from 'compression';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));

  app.use(compression());
  app.use(json({ limit: '10mb', inflate: true }));
  app.use(urlencoded({ limit: '10mb', extended: true }));
  
  const allowed = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({ origin: allowed, credentials: true });

  await app.listen(3001);
  console.log('Backend listening on http://localhost:3001');
}
bootstrap();
