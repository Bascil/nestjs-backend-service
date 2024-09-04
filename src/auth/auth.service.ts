import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async login(authDto: AuthDto) {
    const user = await this.userService.getUserByEmail(authDto.email);
    if (user && (await compare(authDto.password, user.password))) {
      const payload = { sub: user.id, username: user.email };
      const { password, ...result } = user;
      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(user.id);

      await this.saveRefreshToken(refreshToken, user.id);

      return {
        ...result,
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: this.configService.get<string>('TOKEN_TYPE'),
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      const user = await this.userService.getUserById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newAccessToken = this.generateAccessToken({ sub: user.id });
      const newRefreshToken = this.generateRefreshToken(user.id);

      // Replace old refresh token with the new one
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { token: newRefreshToken },
      });

      return {
        ...user,
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        token_type: this.configService.get<string>('TOKEN_TYPE'),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
  }

  generateRefreshToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
  }

  async saveRefreshToken(refreshToken: string, userId: string) {
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userId,
      },
    });
  }
}
