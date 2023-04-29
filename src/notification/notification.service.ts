import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { Repository } from 'typeorm';
import { CreateNotiDto } from './notification.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';

@Injectable()
export class NotificationService {
  @InjectRepository(Notification)
  private readonly notificationRepo: Repository<Notification>;

  async getAllNoti() {
    return await this.notificationRepo.find({ order: { createdAt: 'DESC' } });
  }

  async createNoti(body: CreateNotiDto) {
    const newNoti = this.notificationRepo.create(body);

    try {
      await this.notificationRepo.save(newNoti);
      return createResponse({
        message: 'Created Notification',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteNoti(id: number) {
    try {
      await this.notificationRepo.delete(id);
      return createResponse({
        message: 'Deleted',
        payload: undefined,
        error: '',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
