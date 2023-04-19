import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MembershipBuyReq } from 'src/membership_buy_req/entity/membership_buy_req.entity';
import { Moderator } from 'src/moderator/entity/moderator.entity';
import { Offer } from 'src/offer/entity/offer.entity';
import { OfferBuyReq } from 'src/offer_buy_req/entity/offer_buy_req.entity';
import { Recharge } from 'src/recharge/entity/recharge.entity';
import { RechargeBuyReq } from 'src/recharge_buy_req/entity/recharge_buy_req.entity';
import { TopupReq } from 'src/topup_req/entity/topup_req.entity';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('DB_HOST'),
      port: this.config.get<number>('DB_PORT'),
      database: this.config.get<string>('DB_NAME'),
      username: this.config.get<string>('DB_USERNAME'),
      password: this.config.get<string>('DB_PASSWORD'),
      entities: [
        User,
        Offer,
        OfferBuyReq,
        TopupReq,
        Recharge,
        RechargeBuyReq,
        MembershipBuyReq,
        Moderator,
      ],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'migrations',
      logging: true,
      synchronize: this.config.get<boolean>('DB_SYNC'), // never use TRUE in production!
    };
  }
}
