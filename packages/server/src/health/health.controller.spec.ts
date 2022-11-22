import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: jest.fn()
        }
      ]
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  it('should be defined"', () => {
    expect(healthController).toBeDefined();
  });
});
