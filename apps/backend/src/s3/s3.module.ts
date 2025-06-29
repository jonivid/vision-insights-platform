// apps/api/src/s3/s3.module.ts

import { Global, Module, DynamicModule, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client, HeadBucketCommand, CreateBucketCommand } from '@aws-sdk/client-s3';

// … imports …

@Global()
@Module({})
export class S3Module {
  static forRootAsync(): DynamicModule {
    return {
      module: S3Module,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'S3_CLIENT',
          useFactory: (cs: ConfigService) => {
            const logger = new Logger(S3Module.name);

            // **Require these**; no fallback
            const endpoint = cs.get<string>('S3_ENDPOINT');
            const bucket = cs.get<string>('S3_BUCKET');
            const accessKey = cs.get<string>('S3_ACCESS_KEY');
            const secretKey = cs.get<string>('S3_SECRET_KEY');
            if (!endpoint || !bucket || !accessKey || !secretKey) {
              throw new Error(
                'S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY & S3_SECRET_KEY must all be set',
              );
            }

            const s3 = new S3Client({
              endpoint,
              region: cs.get<string>('S3_REGION', 'us-east-1'),
              credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secretKey,
              },
              forcePathStyle: true,
            });

            // Try HeadBucket → if 404 then CreateBucket → else retry
            const tryEnsureBucket = async () => {
              try {
                await s3.send(new HeadBucketCommand({ Bucket: bucket }));
                logger.log(`✅ Bucket “${bucket}” exists at ${endpoint}`);
              } catch (err: any) {
                if (err.$metadata?.httpStatusCode === 404) {
                  logger.log(`📦 Bucket “${bucket}” not found, creating…`);
                  await s3.send(new CreateBucketCommand({ Bucket: bucket }));
                  logger.log(`✅ Bucket “${bucket}” created`);
                } else {
                  logger.error(
                    `❌ HeadBucket failed, retrying in 5s: ${err.message}`,
                  );
                  setTimeout(tryEnsureBucket, 5000);
                  return;
                }
              }
            };
            tryEnsureBucket();

            return s3;
          },
          inject: [ConfigService],
        },
      ],
      exports: ['S3_CLIENT'],
    };
  }
}
