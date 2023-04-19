import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MembershipBuyReqService } from './membership_buy_req.service';
import {
  CreateMembershipBuyReqDto,
  UpdateMembershipBuyReqApprovedDto,
} from './membership_buy_req.dto';

@ApiTags('membership buy req')
@Controller('membership-buy-req')
export class MembershipBuyReqController {
  @Inject(MembershipBuyReqService)
  private readonly membershipBuyReqService: MembershipBuyReqService;

  @Get()
  getAllMembershipBuyReq() {
    return this.membershipBuyReqService.getAllMembershipBuyReq();
  }

  @Post()
  insertOfferBuyReq(@Body() body: CreateMembershipBuyReqDto) {
    return this.membershipBuyReqService.insertMembershipBuyReq(body);
  }

  @Patch('/:membershipBuyReqId')
  updateOfferBuyStatus(
    @Param('membershipBuyReqId') membershipBuyReqId: number,
    @Body() body: UpdateMembershipBuyReqApprovedDto,
  ) {
    return this.membershipBuyReqService.updateMembershipBuyStatus(
      membershipBuyReqId,
      body,
    );
  }
}
