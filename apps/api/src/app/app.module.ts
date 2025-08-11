import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@featstack/shared-auth-api';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      // ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),

    // Authentication
    AuthModule,
    // DashboardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
