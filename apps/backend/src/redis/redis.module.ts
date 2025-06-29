// apps/api/src/redis/redis.module.ts

import { Global, Module, DynamicModule, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({})
export class RedisModule {
  static forRootAsync(): DynamicModule {
    return {
      module: RedisModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: (cs: ConfigService) => {
            const logger = new Logger(RedisModule.name);
            const url = cs.get<string>('REDIS_URL', 'redis://redis:6379');
            const retryDelay = 5000; // ms

            // Create client in lazy mode so we control connect timing
            const client = new Redis(url, {
              lazyConnect: true,
              retryStrategy(times) {
                // Exponential backoff, capped at 2s
                return Math.min(2 ** times * 100, 2000);
              },
            });

            // Auto‐retry loop, non‐blocking
            const tryConnect = async () => {
              try {
                await client.connect();
                logger.log(`✅ Connected to Redis at ${url}`);
              } catch (err: any) {
                logger.error(
                  `❌ Redis connection failed, retrying in ${retryDelay}ms`,
                  err.message,
                );
                setTimeout(tryConnect, retryDelay);
              }
            };
            tryConnect();

            // Event hooks for visibility
            client.on('ready', () => logger.log('🔄 Redis ready'));
            client.on('reconnecting', (time: number) =>
              logger.log(`⏳ Reconnecting to Redis in ${time}ms`),
            );
            client.on('end', () => logger.log('🛑 Redis connection closed'));
            client.on('error', (err: Error) =>
              logger.warn(`⚠️ Redis error: ${err.message}`),
            );

            return client;
          },
          inject: [ConfigService],
        },
      ],
      exports: ['REDIS_CLIENT'],
    };
  }
}
