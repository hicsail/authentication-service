import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ProjectService } from './project.service';

@Injectable()
export class ProjectGuard implements NestMiddleware {
  constructor(private readonly projectService: ProjectService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    // TODO: All traffic to routes other than `/projects` will check project ID validity
    if (!this.projectService.exists(req.body.projectId)) {
      res.status(HttpStatus.BAD_REQUEST).send('Project ID does not exist');
      return;
    }

    next();
  }
}
