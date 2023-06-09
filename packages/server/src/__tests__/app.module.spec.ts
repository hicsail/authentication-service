import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('AppModule', () => {
  let appModule: TestingModule;

  beforeEach(async () => {
    appModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: PrismaService,
          useValue: jest.fn()
        }
      ]
    }).compile();
  });

  it('should be defined', () => {
    expect(appModule).toBeDefined();
  });
});
