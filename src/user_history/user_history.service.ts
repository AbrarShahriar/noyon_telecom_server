import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserHistory } from './entity/user_history.entity';
import { Between, Repository } from 'typeorm';
import { CreateUserHistoryDto } from './user_history.dto';

@Injectable()
export class UserHistoryService {
  @InjectRepository(UserHistory)
  private readonly userHistoryRepo: Repository<UserHistory>;

  async deleteHistory(reqId) {
    await this.userHistoryRepo.delete({ reqId });
  }

  async getMonthlyHistory(date: string, phone: string) {
    let formattedDate = {
      day: 1,
      month: parseInt(date.split('.')[0]),
      year: parseInt(date.split('.')[1]),
    };

    return await this.userHistoryRepo.find({
      where: {
        phone,
        historyDate: Between(
          new Date(formattedDate.year, formattedDate.month, formattedDate.day),
          new Date(formattedDate.year, formattedDate.month + 1, 1),
        ),
      },
      order: { historyDate: 'DESC' },
    });
  }

  async getTotalHistory(phone: string) {
    return await this.userHistoryRepo.find({
      where: { phone },
      order: { historyDate: 'DESC' },
    });
  }

  async insertUserHistory(body: CreateUserHistoryDto) {
    const newHistory = this.userHistoryRepo.create();

    newHistory.historyType = body.historyType;
    newHistory.amount = body.amount;
    newHistory.phone = body.phone;
    newHistory.saved = body.saved;
    newHistory.reqId = body.reqId;

    if (body.desc) {
      newHistory.desc = body.desc;
    }

    if (body.transactionId) {
      newHistory.transactionId = body.transactionId;
    }

    return await this.userHistoryRepo.save(newHistory);
  }
}
