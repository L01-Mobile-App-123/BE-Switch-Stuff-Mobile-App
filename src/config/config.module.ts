import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // cho phép dùng ConfigService ở mọi nơi
      load: [configuration], // nạp config từ file configuration.ts
      envFilePath: ['.env'], // có thể đổi theo môi trường .env.development, .env.production
    }),
  ],
})
export class AppConfigModule {}
