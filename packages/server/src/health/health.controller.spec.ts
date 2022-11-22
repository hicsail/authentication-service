import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController]
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  it('should be defined"', () => {
    expect(healthController).toBeDefined();
  });
});
