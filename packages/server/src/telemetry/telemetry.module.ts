import { Module } from '@nestjs/common';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    OpenTelemetryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        serviceName: configService.get('SERVICE_NAME')
      }),
      inject: [ConfigService]
    })
  ]
})
export class TelemetryModule {}
