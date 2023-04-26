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
import { CreateUserDto, GetUserDto, UpdateUserBalanceDto } from './user.dto';
import {
  HttpResponse,
  createResponse,
} from 'src/shared/error_handling/HttpResponse';
import { Balance_Actions, Subscription } from './user.enums';
import { Request } from 'express';
import { UserHistoryService } from 'src/user_history/user_history.service';
import { UserHistoryType } from 'src/user_history/user_history.enum';
@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  constructor(private readonly userHistoryService: UserHistoryService) {}

  async getUserFromReq(req: Request) {
    const userInfo = await this.userRepo.findOne({
      where: { id: (req.user as User).id },
      select: {
        name: true,
        subscription: true,
        createdAt: true,
        balance: true,
        phone: true,
      },
    });

    const stat = await this.userHistoryService.getTotalHistory(
      (req.user as User).phone,
    );

    let totalSaved = 0;
    let totalBought = 0;
    let totalSpent = 0;

    stat.forEach((history) => {
      if (
        history.historyType == UserHistoryType.Bundle ||
        history.historyType == UserHistoryType.Internet ||
        history.historyType == UserHistoryType.Minute ||
        history.historyType == UserHistoryType.Recharge
      ) {
        totalBought++;
        totalSpent += history.amount;
      }

      totalSaved += history.saved;
    });

    const data: any = { ...userInfo, totalBought, totalSaved, totalSpent };

    return data;
  }

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
        phone: true,
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

  async updateUserBalance(body: UpdateUserBalanceDto) {
    let user = null;
    if (body.id) {
      user = await this.userRepo.findOne({ where: { id: body.id } });
    } else if (body.phone) {
      user = await this.userRepo.findOne({ where: { phone: body.phone } });
    } else {
      return user;
    }

    let newBalance = user.balance;

    switch (body.balanceAction) {
      case Balance_Actions.INCREMENT:
        newBalance += body.amount;
        break;
      case Balance_Actions.DECREMENT:
        if (user.balance - body.amount < 0) {
          throw new HttpException('Insufficient Balance', HttpStatus.FORBIDDEN);
        } else {
          newBalance -= body.amount;
        }
        break;

      default:
        newBalance = user.balance;
        break;
    }

    try {
      return await this.userRepo.save({
        id: user.id,
        balance: newBalance,
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
