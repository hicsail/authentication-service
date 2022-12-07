import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ProjectService } from './project.service';

@Injectable()
export class ProjectGuard implements NestMiddleware {
  constructor(private readonly projectService: ProjectService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!(await this.projectService.exists(req.body.projectId))) {
      res.status(HttpStatus.BAD_REQUEST).send('Project ID does not exist');
      return;
    }

    next();
  }
}
