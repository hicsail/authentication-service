import { Test, TestingModule } from '@nestjs/testing';
import { LoginController, SignupController } from './auth.controller';
import { LoginService, SignupService } from './auth.service';

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
      await expect(loginController.login(project_id, username, password)).resolves.toBe(expectedResp);
    });
  });
});


describe('SignupController', () => {
  let signupController: SignupController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SignupController],
      providers: [SignupService]
    }).compile();

    signupController = app.get<SignupController>(SignupController);
  });

  describe('/signup', () => {
    it('Should return JWT token', async () => {
      const project_id = '1';
      const username = 'username';
      const method = 'username';
      const password = 'pw';
      const expectedResp = `${project_id}-${username}-${method}-${password}`;
      await expect(signupController.signup(project_id, username, method, password)).resolves.toBe(expectedResp);
    });
  });
});

