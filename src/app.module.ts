import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './config/data-source';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { join } from 'path';
import { ListModule } from "./list/list.module";
import { CardModule } from "./card/card.module";

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
          path: join(__dirname, '/i18n/'), // make sure __dirname resolves correctly
          watch: true,
          json: true,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ResponseInterceptor],
})
export class AppModule {}
