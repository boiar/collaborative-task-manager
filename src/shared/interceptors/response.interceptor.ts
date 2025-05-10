import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  constructor(private readonly i18n: I18nService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => ({
        status: response.statusCode,
        data,
      })),
    );
  }
}
