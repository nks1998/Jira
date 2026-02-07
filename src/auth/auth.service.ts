import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    try {
      const existing = await this.usersService.findUserByEmail(email);
      if (existing) {
        throw new ConflictException('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersService.createUser(
        email,
        hashedPassword,
        name,
      );

      const payload = { sub: user.id, email: user.email };
      const token = this.jwtService.sign(payload);

      return { token, user };
    } catch (err) {
      this.logger.error('Error in register', err);
      throw new InternalServerErrorException(err);
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { token, user };
  }
}
