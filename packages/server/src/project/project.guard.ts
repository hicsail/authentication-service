import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class ProjectGuard implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // TODO: All traffic to routes other than `/projects` will check project ID validity
  }
}
