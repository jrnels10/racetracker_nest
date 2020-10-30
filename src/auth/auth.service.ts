import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuthCredentialsDto,
  AuthSignInCredentialsDto,
} from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.respository';
import { JwtPayload } from '../../dist/auth/jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository)
    private userepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(authcredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userepository.signUp(authcredentialsDto);
  }

  async signin(
    authSignInCredentialsDto: AuthSignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const email = await this.userepository.validateUserPassword(
      authSignInCredentialsDto,
    );
    if (!email) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { email };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(
      `Genereate JWT Token with payload ${JSON.stringify(payload)}`,
    );
    return { accessToken };
  }
}
