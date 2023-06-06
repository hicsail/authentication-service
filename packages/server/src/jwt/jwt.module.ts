import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule, JwtModuleOptions } from '@nestjs/jwt';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          privateKey: configService.get('PRIVATE_KEY'),
          publicKey: configService.get('PUBLIC_KEY_1'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION'),
            issuer: 'https://sail.bu.edu',
            algorithm: 'RS256'
          }
        };
        return options;
      },
      inject: [ConfigService]
    })
  ],
  exports: [NestJwtModule]
})
export class JwtModule {}
