import { Injectable } from '@nestjs/common';

// TODO: Redirect to specific service.
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
