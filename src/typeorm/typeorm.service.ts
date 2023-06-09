import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AdminSetting } from 'src/admin_settings/entity/admin_settings.entity';
import { MembershipBuyReq } from 'src/membership_buy_req/entity/membership_buy_req.entity';
import { Moderator } from 'src/moderator/entity/moderator.entity';
import { Notification } from 'src/notification/entity/notification.entity';
import { Offer } from 'src/offer/entity/offer.entity';
import { OfferBuyReq } from 'src/offer_buy_req/entity/offer_buy_req.entity';
import { Recharge } from 'src/recharge/entity/recharge.entity';
import { RechargeBuyReq } from 'src/recharge_buy_req/entity/recharge_buy_req.entity';
import { TopupReq } from 'src/topup_req/entity/topup_req.entity';
import { User } from 'src/user/entity/user.entity';
import { UserHistory } from 'src/user_history/entity/user_history.entity';
import { WithdrawReq } from 'src/withdraw_req/entity/withdraw.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbConfig = (key: 'DB_PROD_URL' | 'DB_DEV_URL' = 'DB_DEV_URL') => ({
      url: this.config.get<string>(key),
      ssl: key == 'DB_PROD_URL' ? true : false,
    });

    const config = dbConfig('DB_DEV_URL');

    return {
      type: 'postgres',
      url: config.url,
      ssl: config.ssl,
      entities: [
        User,
        Offer,
        OfferBuyReq,
        TopupReq,
        Recharge,
        RechargeBuyReq,
        MembershipBuyReq,
        Moderator,
        UserHistory,
        AdminSetting,
        Notification,
        WithdrawReq,
      ],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'migrations',
      logging: true,
      cache: true,
      synchronize: this.config.get<boolean>('DB_SYNC'), // never use TRUE in production!
      // synchronize: true, // never use TRUE in production!
    };
  }
}
