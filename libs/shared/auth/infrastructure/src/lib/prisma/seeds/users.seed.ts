import { PrismaClient, Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

export async function seedUsers(
  prisma: PrismaClient
): Promise<SeedUsersResult> {
  console.log('Seeding users...');

  const DEFAULT_PASSWORD = process.env?.['SEED_USER_PASSWORD'] || 'password123';
  const SALT_ROUNDS = 10;
  const hashedPassword: string = await bcrypt.hash(
    DEFAULT_PASSWORD,
    SALT_ROUNDS
  );

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
