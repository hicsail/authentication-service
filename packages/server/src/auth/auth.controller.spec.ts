import { JwtAuthGuard } from './jwt-auth.guard';

describe('LoginController', () => {
  let jwtAuthGuard: JwtAuthGuard;

  beforeEach(async () => {
    jwtAuthGuard = new JwtAuthGuard();
  });

  it('should be define', () => {
    expect(jwtAuthGuard).toBeDefined();
  });
});
