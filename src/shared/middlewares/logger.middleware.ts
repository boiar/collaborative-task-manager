import * as fs from 'fs';
import * as path from 'path';
import * as morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';

export class MorganMiddleware {
  private static readonly logDir = path.join(
    path.resolve(__dirname, '..', '..', '..'), // project root
    'logs',
    'requests',
  );

  private static readonly accessLogStream = MorganMiddleware.createLogStream();

  private static readonly logger = morgan('combined', {
    stream: MorganMiddleware.accessLogStream,
  });

  private static createLogStream() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    return fs.createWriteStream(path.join(this.logDir, 'access.log'), {
      flags: 'a',
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    return MorganMiddleware.logger(req, res, next);
  }
}
