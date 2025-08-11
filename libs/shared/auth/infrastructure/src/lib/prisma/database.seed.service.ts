import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { seedUsers } from './seeds/users.seed';
import { seedTokens } from './seeds/tokens.seed';

@Injectable()
export class DatabaseSeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    console.log('Seeding with DatabaseSeedService...');
    const { admin, moderator, users } = await seedUsers(this.prisma);
    await seedTokens(this.prisma, [admin, moderator, ...users]);
    console.log('Done!');
  }
}
