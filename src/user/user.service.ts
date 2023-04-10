import {
  ConflictException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, GetUserDto } from './user.dto';
import { HttpResponse, createResponse } from 'src/shared/types/HttpResponse';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  async getUserByPhone(phone: string): Promise<GetUserDto | null> {
    const user = await this.userRepo.findOne({
      where: { phone },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async createUser(body: CreateUserDto): Promise<HttpResponse> {
    const userExists = await this.getUserByPhone(body.phone);

    if (userExists) {
      throw new ConflictException('This Phone Number Is Already In Use');
    }

    const user = this.userRepo.create();

    user.name = body.name;
    user.phone = body.phone;
    user.pin = await bcrypt.hash(body.pin, 10);

    try {
      await this.userRepo.save(user);
      return createResponse({
        message: 'User Created',
        payload: null,
        error: null,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
