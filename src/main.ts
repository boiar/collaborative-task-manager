import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MorganMiddleware } from './shared/middlewares/logger.middleware';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.enableCors();

  // enable view engine
  app.setViewEngine('ejs');
  //directory for templates
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.useGlobalInterceptors(app.get(ResponseInterceptor));

  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  // Serve static uploads at
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Register the morgan middleware for log
  app.use(new MorganMiddleware().use.bind(new MorganMiddleware()));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
