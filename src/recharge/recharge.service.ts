import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recharge } from './entity/recharge.entity';
import { Repository } from 'typeorm';
import { CreateRechargeDto } from './recharge.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';

@Injectable()
export class RechargeService {
  @InjectRepository(Recharge)
  private readonly rechargeRepo: Repository<Recharge>;

  async getAllRechargeOffers(): Promise<Recharge[]> {
    return await this.rechargeRepo.find();
  }

  async createRechargeOffer(body: CreateRechargeDto) {
    const newRecharge = this.rechargeRepo.create();
    newRecharge.amount = body.amount;

    try {
      await this.rechargeRepo.save(newRecharge);
      return createResponse({
        message: 'Recharge Offer Added',
        payload: newRecharge,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
