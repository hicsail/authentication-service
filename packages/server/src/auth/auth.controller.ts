import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsernameLoginTransformPipe, EmailLoginTransformPipe, SignupTransformPipe, UserSignupDto, EmailLoginDto, UsernameLoginDto } from './dto/auth.dto';
import { AccessToken } from './types/auth.types';

@Controller('/login')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Post('/username')
  @UsePipes(new UsernameLoginTransformPipe())
  async loginUsername(@Body() user: UsernameLoginDto): Promise<AccessToken> {
    return this.authService.validateUsername(user.project_id, user.username, user.password);
  }

  @Post('/email')
  @UsePipes(new EmailLoginTransformPipe())
  async loginEmail(@Body() user: EmailLoginDto): Promise<AccessToken> {
    return this.authService.validateEmail(user.project_id, user.email, user.password);
  }
}

@Controller('/signup')
export class SignupController {
  constructor(private authService: AuthService) {}

  @Post()
  @UsePipes(new SignupTransformPipe())
  async signup(@Body() user: UserSignupDto): Promise<AccessToken> {
    return await this.authService.signup({ ...user });
  }
}
