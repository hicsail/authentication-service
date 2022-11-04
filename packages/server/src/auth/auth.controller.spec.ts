import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './auth.controller';
import { LoginService } from './auth.service';

describe('LoginController', () => {
  let loginController: LoginController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [LoginService]
    }).compile();

    loginController = app.get<LoginController>(LoginController);
  });

  describe('/signup', () => {
    it('Should return JWT token', async () => {
      const project_id = '1';
      const username = 'username';
      const method = 'username';
      const password = 'pw';
      const expectedResp = `${project_id}-${username}-${method}-${password}`;
      await expect(loginController.signup(project_id, username, method, password)).resolves.toBe(expectedResp);
    });
  });
});
