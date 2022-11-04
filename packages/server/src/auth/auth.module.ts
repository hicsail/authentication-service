import { Module } from '@nestjs/common';
import { LoginController } from './auth.controller';
import { LoginService } from './auth.service';

@Module({
  controllers: [LoginController],
  providers: [LoginService]
})
export class LoginModule {}
