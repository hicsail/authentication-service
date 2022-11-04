import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService {
  login(): string {
    // check username and check email
    return 'JWT token';
  }

  forgot(): void {
    // TODO:
    // 1. send email
  }

  reset(): void {
    // TODO:
    // 1 Check credentials
    // 2. Send email
  }
}

@Injectable()
export class SignupService {
  async signup(project_id: string, username: string, method: string, password: string): Promise<string> {
    // TODO:
    // 0. Check password strength and credentials
    // 1. Create account using inputs
    // 2. Return JWT token
    try {
      // const saltLength = 10;
      const salt = await bcrypt.genSalt();
      const passwordSaltSHA256 = bcrypt.hash(password, salt);
      console.log(passwordSaltSHA256);
      return `${project_id}-${username}-${method}-${password}`;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}