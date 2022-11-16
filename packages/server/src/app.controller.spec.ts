import { JwtAuthGuard } from './auth/jwt-auth.guard';

describe('AppController', () => {
  let jwtAuthGuard: JwtAuthGuard;

  beforeEach(async () => {
    jwtAuthGuard = new JwtAuthGuard();
  });

  it('should be define', () => {
    expect(jwtAuthGuard).toBeDefined();
  });
});
