// src/shared/decorators/upload-file.decorator.ts
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../config/multer.util';

export function UploadFile(fieldName = 'file') {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, multerConfig) as any),
  );
}