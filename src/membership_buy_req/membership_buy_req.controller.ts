import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MembershipBuyReqService } from './membership_buy_req.service';
import {
  CreateMembershipBuyReqDto,
  MembershipRejectReqDto,
  UpdateMembershipBuyReqApprovedDto,
} from './membership_buy_req.dto';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { Public } from 'src/shared/security/PublicEndpoint';

@ApiTags('membership buy req')
@Controller('membership-buy-req')
export class MembershipBuyReqController {
  @Inject(MembershipBuyReqService)
  private readonly membershipBuyReqService: MembershipBuyReqService;

  @Public()
  @UseGuards(AdminGuard)
  @Get()
  getAllMembershipBuyReq() {
    return this.membershipBuyReqService.getAllMembershipBuyReq();
  }

  @Public()
  @UseGuards(AdminGuard)
  @Post('/reject')
  rejectTopupReq(@Body() body: MembershipRejectReqDto) {
    return this.membershipBuyReqService.rejectReq(body);
  }

  @Post()
  insertOfferBuyReq(@Body() body: CreateMembershipBuyReqDto) {
    return this.membershipBuyReqService.insertMembershipBuyReq(body);
  }

  @Public()
  @UseGuards(AdminGuard)
  @Patch('/')
  updateOfferBuyStatus(@Body() body: UpdateMembershipBuyReqApprovedDto) {
    return this.membershipBuyReqService.updateMembershipBuyStatus(body);
  }
}
