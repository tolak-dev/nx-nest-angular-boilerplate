import {
  PrismaClient,
  User,
  RefreshToken,
  PasswordReset,
} from '@prisma/client';
import { randomBytes } from 'crypto';

export async function seedTokens(
  prisma: PrismaClient,
  users: User[]
): Promise<RefreshToken[]> {
  console.log('🌱 Seeding refresh tokens...');

  // Clear existing refresh tokens
  await prisma.refreshToken.deleteMany({});

  const refreshTokens: RefreshToken[] = [];

  // Create refresh tokens for active users
  for (const user of users) {
    if (user.isActive && user.isEmailVerified) {
      // Create 1-2 refresh tokens per user
      const tokenCount = Math.random() > 0.5 ? 2 : 1;

      for (let i = 0; i < tokenCount; i++) {
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        const refreshToken = await prisma.refreshToken.create({
          data: {
            token,
            userId: user.id,
            expiresAt,
          },
        });
        refreshTokens.push(refreshToken);
      }
    }
  }

  console.log(`Created ${refreshTokens.length} refresh tokens`);
  return refreshTokens;
}

export async function seedPasswordResets(
  prisma: PrismaClient,
  users: User[]
): Promise<PasswordReset[]> {
  console.log(' Seeding password reset tokens...');

  // Clear existing password resets
  await prisma.passwordReset.deleteMany({});

  const passwordResets: PasswordReset[] = [];

  // Create password reset for one user (for testing)
  const userNeedingReset = users.find(
    (u: User) => u.email === 'charlie.davis@example.com'
  );

  if (userNeedingReset) {
    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const passwordReset = await prisma.passwordReset.create({
      data: {
        userId: userNeedingReset.id,
        token: resetToken,
        expiresAt,
      },
    });
    passwordResets.push(passwordReset);
  }

  console.log(`Created ${passwordResets.length} password reset tokens`);
  return passwordResets;
}
