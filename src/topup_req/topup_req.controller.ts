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
import { TopupReqService } from './topup_req.service';
import {
  CreateTopupReqDto,
  RejectReqDto,
  TopupReqApprovedDto,
} from './topup_req.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { Public } from 'src/shared/security/PublicEndpoint';

@ApiTags('topup req')
@Controller('topup-req')
export class TopupReqController {
  @Inject(TopupReqService)
  private readonly topupReqService: TopupReqService;

  @Public()
  @UseGuards(AdminGuard)
  @Post('/reject')
  rejectReq(@Body() body: RejectReqDto) {
    return this.topupReqService.rejectReq(body);
  }

  @Post()
  insertTopupReq(@Body() body: CreateTopupReqDto) {
    return this.topupReqService.insertTopupReq(body);
  }

  @Public()
  @UseGuards(AdminGuard)
  @Get()
  getAllTopupReqs() {
    return this.topupReqService.getAllTopupReqs();
  }

  @Public()
  @UseGuards(AdminGuard)
  @Patch()
  updateTopupReqStatus(@Body() body: TopupReqApprovedDto) {
    return this.topupReqService.updateTopupReqStatus(body);
  }
}
