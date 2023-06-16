import * as sinon from 'sinon';
import { PrismaService } from '../../prisma/prisma.service';
import { HealthService } from '../health.service';
import { Logger } from '@nestjs/common';

const sandbox = sinon.createSandbox();

describe('HealthService', () => {
  let healthService: HealthService;
  let mockPrismaService: sinon.SinonStubbedInstance<PrismaService>;

  beforeEach(async () => {
    mockPrismaService = sandbox.createStubInstance(PrismaService);
    healthService = new HealthService(mockPrismaService);
    mockPrismaService.$queryRaw = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be defined', () => {
    expect(healthService).toBeDefined();
  });

  describe('isDbReady', () => {
    it('should return true if the database is ready', async () => {
      // Arrange
      mockPrismaService.$queryRaw.resolves();

      // Act
      const result = await healthService.isDbReady();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false if there is an error while checking the database', async () => {
      // Arrange
      mockPrismaService.$queryRaw.throws(new Error());

      // Act
      const result = await healthService.isDbReady();

      expect(result).toBe(false);
    });
  });
});
