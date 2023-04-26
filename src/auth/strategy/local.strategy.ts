import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../../user/entity/user.entity';
import { UserService } from '../../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'phone',
      passwordField: 'pin',
    });
  }

  async validate(phone: string, password: string): Promise<User | any> {
    const user = await this.userService.getUserByPhone(phone);

    if (!user) {
      throw new HttpException(
        'No Account Found Under This Phone Number',
        HttpStatus.NOT_FOUND,
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.pin);

    if (user && passwordMatch) {
      return user;
    }

    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong Pin');
    }
  }
}
