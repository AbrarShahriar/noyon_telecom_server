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
import {
  CreateUserDto,
  GetUserDto,
  UpdateUserBalanceDto,
  VerifyPinDto,
} from './user.dto';
import {
  HttpResponse,
  createResponse,
} from 'src/shared/error_handling/HttpResponse';
import { Balance_Actions, Subscription } from './user.enums';
import { Request } from 'express';
import { OfferBuyReq } from 'src/offer_buy_req/entity/offer_buy_req.entity';
import { ReqStatus } from 'src/shared/enums/enums';
@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  @InjectRepository(OfferBuyReq)
  private readonly offerBuyReqRepo: Repository<OfferBuyReq>;

  async verifyPin(pin: string, phone: string) {
    let user = await this.getUserByPhone(phone);

    let pinMatch = await bcrypt.compare(pin, user.pin);
    if (pinMatch) {
      return {
        success: true,
      };
    } else {
      return { success: false };
    }
  }

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

    const stats = await this.offerBuyReqRepo.find({
      relations: { offer: true },
      where: [
        { phone: userInfo.phone, reqStatus: ReqStatus.PENDING },
        { phone: userInfo.phone, reqStatus: ReqStatus.APPROVED },
      ],
      select: {
        offer: {
          discountPrice: true,
          regularPrice: true,
        },
      },
    });

    let totalBought = 0;
    let totalSpent = 0;

    stats.forEach((stat) => {
      totalBought += stat.offer.regularPrice;
      totalSpent += stat.offer.discountPrice;
    });

    const data: any = {
      ...userInfo,
      totalBought,
      totalSpent,
    };

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

  async getAllUserBalance() {
    let userBalance = 0;
    const users = await this.userRepo.find({ select: { balance: true } });
    users.forEach((user) => (userBalance += user.balance));
    return userBalance;
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
    console.log(Number(body.amount));

    let user: User | null = null;
    if (body.id) {
      user = await this.userRepo.findOne({ where: { id: body.id } });
    } else if (body.phone) {
      user = await this.userRepo.findOne({ where: { phone: body.phone } });
    } else {
      return user;
    }

    let newBalance = Number(user.balance);
    console.log('newBalance', newBalance, typeof newBalance);

    switch (body.balanceAction) {
      case Balance_Actions.INCREMENT:
        newBalance += Number(body.amount);
        break;
      case Balance_Actions.DECREMENT:
        if (user.balance - Number(body.amount) < 0) {
          throw new HttpException('Insufficient Balance', HttpStatus.FORBIDDEN);
        } else {
          newBalance -= Number(body.amount);
        }
        break;

      default:
        newBalance = user.balance;
        break;
    }

    console.log(newBalance);

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
