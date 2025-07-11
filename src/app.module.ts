import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './config/data-source';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { join } from 'path';
import { ListModule } from './list/list.module';
import { CardModule } from './card/card.module';
import { LoggerModule } from './shared/logger/logger.module';
import { NotificationModule } from './notification/notification.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './shared/guards/throttler.guard';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigService available globally
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    UserModule,
    BoardModule,
    ListModule,
    CardModule,
    AuthModule,
    LoggerModule,
    I18nModule.forRootAsync({
      imports: [],
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        { use: HeaderResolver, options: ['x-lang'] },
        AcceptLanguageResolver,
      ],
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get('FALLBACK_LANGUAGE') || 'en',
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
          json: true,
        },
      }),
      inject: [ConfigService],
    }),
    NotificationModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, //60 sec
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ResponseInterceptor,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
