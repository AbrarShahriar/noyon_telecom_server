import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TopupReqService } from './topup_req.service';
import { CreateTopupReqDto, TopupReqApprovedDto } from './topup_req.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('topup req')
@Controller('topup-req')
export class TopupReqController {
  @Inject(TopupReqService)
  private readonly topupReqService: TopupReqService;

  @Post()
  insertTopupReq(@Body() body: CreateTopupReqDto) {
    return this.topupReqService.insertTopupReq(body);
  }

  @Get()
  getAllTopupReqs() {
    return this.topupReqService.getAllTopupReqs();
  }

  @Patch('/:topupReqId')
  updateTopupReqStatus(
    @Param('topupReqId') topupReqId: number,
    @Body() body: TopupReqApprovedDto,
  ) {
    return this.topupReqService.updateTopupReqStatus(topupReqId, body);
  }
}
