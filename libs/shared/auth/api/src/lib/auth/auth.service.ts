import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, Role } from '@prisma/client';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import {
  AuthResponse,
  UserResponse,
} from '../interfaces/auth-response.interface';
import { plainToInstance } from 'class-transformer';
import { randomBytes } from 'crypto';
import { NotificationService } from '@featstack/shared-notifications';
import {
  PrismaService,
  handlePrismaError,
} from '@featstack/shared-auth-infrastructure';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, username, password, firstName, lastName } = registerDto;

    if (this.configService.get<string>('DISABLE_REGISTER') === 'true') {
      throw new BadRequestException('Registration is currently disabled');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      }
      if (existingUser.username === username) {
        throw new ConflictException('Username already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user: User;
    try {
      user = await this.prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          firstName,
          lastName,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: plainToInstance(UserResponse, this.excludePassword(user)),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    let user: User | null;
    try {
      user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new UnauthorizedException('No account found with this email');
      }
    } catch (error) {
      handlePrismaError(error, 'User', email);
      throw error;
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account is inactive. Please contact support.'
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password. Please try again.');
    }

    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    } catch (error) {
      // Log but do not block login
      console.error('Failed to update lastLoginAt', error);
      handlePrismaError(error, 'User', user.id);
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: plainToInstance(UserResponse, this.excludePassword(user)),
      ...tokens,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    const { refreshToken } = refreshTokenDto;

    let storedToken;
    try {
      storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });
      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
    } catch (error) {
      handlePrismaError(error, 'RefreshToken', refreshToken);
      throw error;
    }

    if (!storedToken.user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    const tokens = await this.generateTokens(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role
    );

    try {
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: {
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
    } catch (error) {
      handlePrismaError(error, 'RefreshToken', storedToken.id);
      throw new InternalServerErrorException('Failed to update refresh token');
    }

    return {
      user: plainToInstance(
        UserResponse,
        this.excludePassword(storedToken.user)
      ),
      ...tokens,
    };
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    try {
      await this.prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: refreshToken,
        },
      });
    } catch (error) {
      console.error('Logout failed:', error);
      handlePrismaError(error, 'RefreshToken', refreshToken);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    try {
      await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
    } catch (error) {
      console.error('Logout all failed:', error);
      handlePrismaError(error, 'RefreshToken', userId);
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    let user: User | null;
    try {
      user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException('User with this email does not exist.');
      }
    } catch (error) {
      handlePrismaError(error, 'User', email);
      throw error;
    }

    if (!user.isActive) {
      throw new ForbiddenException('User account is disabled.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password.');
    }

    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error, 'User', id);
      throw error;
    }
  }

  private async generateTokens(userId: string, email: string, role: Role) {
    const payload = { sub: userId, email, role };

    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
        }),
        this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_EXPIRES_IN',
            '7d'
          ),
        }),
      ]);
      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate tokens');
    }
  }

  private async saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    try {
      await this.prisma.refreshToken.create({
        data: {
          token,
          userId,
          expiresAt,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to save refresh token');
    }
  }

  async sendResetLink(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return;

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    try {
      await this.prisma.passwordReset.upsert({
        where: { userId: user.id },
        update: { token, expiresAt: expires },
        create: { userId: user.id, token, expiresAt: expires },
      });

      await this.notificationService.sendResetPasswordEmail(user.email, token);
    } catch (error) {
      console.error('Failed to send reset password email:', error);
      handlePrismaError(error, 'PasswordReset', user.id);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let reset;
    try {
      reset = await this.prisma.passwordReset.findUnique({
        where: { token },
      });
      if (!reset || reset.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    } catch (error) {
      handlePrismaError(error, 'PasswordReset', token);
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
      await this.prisma.user.update({
        where: { id: reset.userId },
        data: { password: hashedPassword },
      });
      await this.prisma.passwordReset.delete({ where: { token } });
    } catch (error) {
      handlePrismaError(error, 'User or PasswordReset', reset.userId);
      throw new InternalServerErrorException('Failed to reset password');
    }
  }

  private excludePassword(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
