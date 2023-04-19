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
import {
  HttpResponse,
  createResponse,
} from 'src/shared/error_handling/HttpResponse';
import { Subscription } from './user.enums';
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

  async getAllUsers() {
    return await this.userRepo.find({
      select: {
        id: true,
        name: true,
        balance: true,
        createdAt: true,
      },
    });
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

  async updateUserBalance(
    phone: string,
    prevBalance: number,
    topupAmount: number,
  ) {
    const user = await this.userRepo.findOne({ where: { phone } });

    if (user.balance != prevBalance) {
      throw new HttpException('Something Went Wrong', HttpStatus.BAD_REQUEST);
    }

    user.balance += topupAmount;

    try {
      return await this.userRepo.save({
        id: user.id,
        balance: user.balance,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUserMembership(phone) {
    try {
      return await this.userRepo.update(
        { phone },
        { subscription: Subscription.PREMIUM },
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(userId: string): Promise<HttpResponse> {
    try {
      await this.userRepo.delete(userId);
      return createResponse({
        message: 'User Deleted',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
