import {
  PrismaClient,
  Role,
  User,
  RefreshToken,
  PasswordReset,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

interface UserSeedData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  emailVerificationToken?: string;
  isActive?: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

interface SeedUsersResult {
  admin: User;
  moderator: User;
  users: User[];
}

async function seedUsers(): Promise<SeedUsersResult> {
  console.log('Seeding users...');

  const hashedPassword: string = await bcrypt.hash('password123', 10);

  // Admin user
  const admin: User = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
      isEmailVerified: true,
      lastLoginAt: new Date(),
    },
  });

  // Moderator user
  const moderator: User = await prisma.user.upsert({
    where: { email: 'moderator@example.com' },
    update: {},
    create: {
      email: 'moderator@example.com',
      username: 'moderator',
      firstName: 'Community',
      lastName: 'Moderator',
      password: hashedPassword,
      role: Role.MODERATOR,
      isActive: true,
      isEmailVerified: true,
      lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    },
  });

  // Regular users with varied data
  const userSeeds: UserSeedData[] = [
    {
      email: 'john.doe@example.com',
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      isEmailVerified: true,
      lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      email: 'jane.smith@example.com',
      username: 'janesmith',
      firstName: 'Jane',
      lastName: 'Smith',
      isEmailVerified: true,
      lastLoginAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
    {
      email: 'bob.wilson@example.com',
      username: 'bobwilson',
      firstName: 'Bob',
      lastName: 'Wilson',
      isEmailVerified: false,
      emailVerificationToken: 'verify_token_bob_123',
    },
    {
      email: 'alice.brown@example.com',
      username: 'alicebrown',
      firstName: 'Alice',
      lastName: 'Brown',
      isEmailVerified: true,
      isActive: false, // Inactive user
    },
    {
      email: 'charlie.davis@example.com',
      username: 'charliedavis',
      firstName: 'Charlie',
      lastName: 'Davis',
      isEmailVerified: false,
      passwordResetToken: 'reset_token_charlie_456',
      passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    },
  ];

  const users: User[] = [];
  for (const userData of userSeeds) {
    const user: User = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: hashedPassword,
        role: Role.USER,
        isActive: userData.isActive ?? true,
      },
    });
    users.push(user);
  }

  console.log(`Created/updated ${users.length + 2} users`);
  return { admin, moderator, users };
}

async function seedTokens(users: User[]): Promise<RefreshToken[]> {
  console.log(' Seeding refresh tokens...');

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

async function seedPasswordResets(users: User[]): Promise<PasswordReset[]> {
  console.log('Seeding password reset tokens...');

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

async function main(): Promise<void> {
  console.log(' Starting database seeding process...');
  console.log('=====================================');

  try {
    // Seed users first
    const { admin, moderator, users }: SeedUsersResult = await seedUsers();
    const allUsers: User[] = [admin, moderator, ...users];

    // Seed tokens (depends on users)
    await seedTokens(allUsers);

    // Seed password resets
    await seedPasswordResets(allUsers);

    console.log('=====================================');
    console.log(' Database seeding completed successfully!');
    console.log('');
    console.log('Test Accounts:');
    console.log('Admin: admin@example.com / password123');
    console.log('Moderator: moderator@example.com / password123');
    console.log('Users:');
    console.log('- john.doe@example.com / password123 (verified, active)');
    console.log('- jane.smith@example.com / password123 (verified, active)');
    console.log('- bob.wilson@example.com / password123 (unverified)');
    console.log('- alice.brown@example.com / password123 (verified, inactive)');
    console.log(' - charlie.davis@example.com / password123 (has reset token)');
    console.log('');
    console.log(' Use these accounts for testing authentication flows!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e: Error) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Database connection closed');
  });
