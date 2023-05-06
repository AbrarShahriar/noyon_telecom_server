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
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { Public } from 'src/shared/security/PublicEndpoint';
import { WithdrawReqService } from './withdraw_req.service';
import { CreateWithdrawReqDto, UpdateWithdrawReqDto } from './withdraw_req.dto';

@Controller('withdraw-req')
export class WithdrawReqController {
  @Inject(WithdrawReqService)
  private readonly withdrawReqService: WithdrawReqService;

  @Public()
  @UseGuards(AdminGuard)
  @Get('/pending')
  getPendingReqs() {
    return this.withdrawReqService.getAllPendingReqs();
  }

  @Public()
  @UseGuards(AdminGuard)
  @Get('/all/:moderatorId')
  getReqsHistory(@Param('moderatorId') moderatorId: number) {
    return this.withdrawReqService.getAllHistoryOfModerator(moderatorId);
  }

  @Public()
  @UseGuards(AdminGuard)
  @Get('/all')
  getAllReqsHistory() {
    return this.withdrawReqService.getAllHistory();
  }

  @Public()
  @UseGuards(AdminGuard)
  @Post()
  insertReq(@Body() body: CreateWithdrawReqDto) {
    return this.withdrawReqService.insertReq(body);
  }

  @Public()
  @UseGuards(AdminGuard)
  @Patch()
  updateReqStatus(@Body() body: UpdateWithdrawReqDto) {
    return this.withdrawReqService.updateReq(body);
  }
}
