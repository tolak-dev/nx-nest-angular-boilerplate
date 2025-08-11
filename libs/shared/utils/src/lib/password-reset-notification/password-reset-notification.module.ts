import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from './password-reset-notification.service';

@Module({
  imports: [ConfigModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
