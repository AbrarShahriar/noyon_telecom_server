import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm/typeorm.service';
import { OfferModule } from './offer/offer.module';
import { OfferBuyReqModule } from './offer_buy_req/offer_buy_req.module';
import { TopupReqModule } from './topup_req/topup_req.module';
import { RechargeModule } from './recharge/recharge.module';
import { RechargeBuyReqModule } from './recharge_buy_req/recharge_buy_req.module';
import { MembershipBuyReqModule } from './membership_buy_req/membership_buy_req.module';
import { ModeratorModule } from './moderator/moderator.module';
import { AuthModule } from './auth/auth.module';
import { UserHistoryModule } from './user_history/user_history.module';
import { AdminSettingsModule } from './admin_settings/admin_settings.module';
import { AdminModule } from './admin/admin.module';
import { NotificationModule } from './notification/notification.module';
import { WithdrawReqModule } from './withdraw_req/withdraw_req.module';
import { LoggerMiddleware } from './shared/middleware/logger.middleware';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true, // colorizes the log
            translateTime: 'dd-mm-yyyy, h:MM:ss TT',
            singleLine: true,
          },
        },
      },
    }),
    AuthModule,
    UserModule,
    OfferModule,
    OfferBuyReqModule,
    TopupReqModule,
    RechargeModule,
    RechargeBuyReqModule,
    MembershipBuyReqModule,
    ModeratorModule,
    UserHistoryModule,
    AdminSettingsModule,
    AdminModule,
    NotificationModule,
    WithdrawReqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
