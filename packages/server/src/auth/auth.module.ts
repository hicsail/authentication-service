import { Module } from '@nestjs/common';
import { LoginController } from './auth.controller';
import { LoginService, SignupService } from './auth.service';

@Module({
  controllers: [LoginController],
  providers: [LoginService, SignupService]
})
export class LoginModule {}
