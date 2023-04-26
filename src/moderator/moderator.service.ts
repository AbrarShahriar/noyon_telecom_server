import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Moderator } from './entity/moderator.entity';
import { Repository } from 'typeorm';
import { CreateModeratorDto, LoginModeratorDto } from './moderator.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MembershipBuyReqService } from 'src/membership_buy_req/membership_buy_req.service';
import { OfferBuyReqService } from 'src/offer_buy_req/offer_buy_req.service';
import { RechargeBuyReqService } from 'src/recharge_buy_req/recharge_buy_req.service';
import { TopupReqService } from 'src/topup_req/topup_req.service';

@Injectable()
export class ModeratorService {
  @InjectRepository(Moderator)
  private readonly moderatorRepo: Repository<Moderator>;

  constructor(
    private readonly configService: ConfigService,
    private readonly membershipBuyReqService: MembershipBuyReqService,
    private readonly offerBuyReqService: OfferBuyReqService,
    private readonly rechargeReqService: RechargeBuyReqService,
    private readonly topupReqService: TopupReqService,
  ) {}

  async getModeratorInAndOut(moderatorId: number) {
    const offerBuyReqs =
      await this.offerBuyReqService.getApprovedOfferBuyReqsOfModerator(
        moderatorId,
      );
    const rechargeBuyReqs =
      await this.rechargeReqService.getApprovedRechargeBuyReqsOfModerator(
        moderatorId,
      );

    let inVal = 0;
    let outVal = 0;

    offerBuyReqs.forEach((req) => {
      outVal += req.offer.discountPrice;
    });
    rechargeBuyReqs.forEach((req) => {
      outVal += req.amount;
    });

    return {
      inVal,
      outVal,
    };
  }

  async getTotalTransactionHistory(moderatorId: number, date) {
    let formattedDate: any = null;

    if (date) {
      let d = date.split('.');
      formattedDate = {
        day: d[0],
        month: d[1],
        year: d[2],
      };
    }
    console.log(date, formattedDate);

    const offerBuyReqs = date
      ? await this.offerBuyReqService.getApprovedOfferBuyReqsOfModerator(
          moderatorId,
          formattedDate,
        )
      : await this.offerBuyReqService.getApprovedOfferBuyReqsOfModerator(
          moderatorId,
        );

    const rechargeBuyReqs = date
      ? await this.rechargeReqService.getApprovedRechargeBuyReqsOfModerator(
          moderatorId,
          formattedDate,
        )
      : await this.rechargeReqService.getApprovedRechargeBuyReqsOfModerator(
          moderatorId,
        );

    const formattedData: any = [];

    offerBuyReqs.forEach((req) => {
      let approvedBy = '';
      if (req.approvedBy) {
        approvedBy = req.approvedBy;
      } else if (req.moderator) {
        approvedBy = req.moderator.username;
      }

      formattedData.push({
        type: req.offer.category,
        userPhone: req.phone,
        amount: req.offer.discountPrice,
        approvedBy: approvedBy,
        approvedAt: req.approvedAt,
      });
    });

    rechargeBuyReqs.forEach((req) => {
      let approvedBy = '';
      if (req.approvedBy) {
        approvedBy = req.approvedBy;
      } else if (req.moderator) {
        approvedBy = req.moderator.username;
      }

      formattedData.push({
        type: 'membership',
        userPhone: req.phone,
        amount: req.amount,
        approvedBy: approvedBy,
        approvedAt: req.approvedAt,
      });
    });

    return formattedData;
  }

  async loginModerator(body: LoginModeratorDto) {
    const moderator = await this.moderatorRepo.findOne({
      where: { username: body.username },
    });

    if (!moderator) {
      throw new NotFoundException(`Moderator: ${body.username} not found!`);
    }

    const passwordMatch = await bcrypt.compare(
      body.password,
      moderator.password,
    );

    if (passwordMatch) {
      return {
        moderatorKey: this.configService.get('MODERATOR_KEY'),
        moderatorId: moderator.id,
      };
    }

    throw new HttpException('Something Went Wrong', HttpStatus.BAD_REQUEST);
  }

  async getModeratorByUsername(username: string) {
    return await this.moderatorRepo.findOne({ where: { username } });
  }

  async getAllModerator() {
    return await this.moderatorRepo.find({
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
      loadRelationIds: true,
    });
  }

  async createModerator(body: CreateModeratorDto) {
    const moderatorExists = await this.getModeratorByUsername(body.username);

    if (moderatorExists) {
      throw new ConflictException('This Username Is Taken');
    }

    const newModerator = this.moderatorRepo.create();

    newModerator.username = body.username;
    newModerator.password = await bcrypt.hash(body.password, 10);

    try {
      await this.moderatorRepo.save(newModerator);
      return createResponse({
        message: 'Moderator Created',
        payload: null,
        error: null,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteModerator(moderatorId: number) {
    try {
      await this.moderatorRepo.delete(moderatorId);
      return createResponse({
        message: 'Moderator Deleted',
        payload: { moderatorId },
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
