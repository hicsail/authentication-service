import { Module, DynamicModule } from '@nestjs/common';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';

@Module({})
export class TelemetryModule {
  static forRoot(serviceName: string): DynamicModule {
    return {
      module: TelemetryModule,
      imports: [
        OpenTelemetryModule.forRoot({
          serviceName,
        }),
      ],
      exports: [OpenTelemetryModule],
    };
  }
}
