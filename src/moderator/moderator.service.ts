import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Moderator } from './entity/moderator.entity';
import { Repository } from 'typeorm';
import { CreateModeratorDto } from './moderator.dto';
import { createResponse } from 'src/shared/error_handling/HttpResponse';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ModeratorService {
  @InjectRepository(Moderator)
  private readonly moderatorRepo: Repository<Moderator>;

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
