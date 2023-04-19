import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    const user = (await this.userService.getUserByPhone(phone)) as User;

    const passwordMatch = await bcrypt.compare(password, user.pin);

    if (user && passwordMatch) {
      return user;
    }

    if (user == undefined) {
      throw new UnauthorizedException('User not found');
    }

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid Pin');
    }
  }
}
