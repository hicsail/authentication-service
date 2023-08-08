import { HttpModule, HttpService } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_MODULE_OPTIONS } from '@nestjs/jwt/dist/jwt.constants';
import { firstValueFrom } from 'rxjs';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';
import { PassportModule } from '@nestjs/passport';
import { AuthModuleOptionsAsync, AuthModuleOptions } from './auth.interface';

@Module({})
export class AuthModule {
  private static publicKey: string | null = null;

  static register(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        PassportModule,
        HttpModule,
        this.getJwtModule(options)
      ],
      providers: [
        JwtAuthGuard,
        JwtStrategy,
        {
          provide: JwtStrategy,
          inject: [HttpService],
          useFactory: async(httpService: HttpService) => new JwtStrategy({
            publicKey: await this.getPublicKeyHelper(options.publicKeyURL, httpService)
          }),
        }
      ],
      exports: [JwtAuthGuard]
    };
  }

  static registerAsync(options: AuthModuleOptionsAsync): DynamicModule {
    const jwtModuleOptionsProvider: Provider = {
      provide: JWT_MODULE_OPTIONS,
      inject: options.inject,
      useFactory: options.useFactory
    };

    return {
      module: AuthModule,
      imports: [
        PassportModule,
        this.getJwtModuleAsync(options, jwtModuleOptionsProvider),
        ...options.imports
      ],
      providers: [
        JwtAuthGuard,
        JwtStrategy,
        jwtModuleOptionsProvider
      ],
      exports: [JwtAuthGuard]
    }
  }

  /** Make the JWT module, grabbing the public key from the provided URL */
  private static async getJwtModule(options: AuthModuleOptions): Promise<DynamicModule> {
    return JwtModule.registerAsync({
      imports: [HttpModule],
      inject: [HttpService],
      useFactory: async (httpService: HttpService) => ({
        publicKey: await this.getPublicKeyHelper(options.publicKeyURL, httpService),
        signOptions: {
          algorithm: options.signAlgorithm
        }
      })
    })
  }

  private static getJwtModuleAsync(options: AuthModuleOptionsAsync, jwtModuleOptionsProvider: Provider): DynamicModule {
    return {
      module: JwtModule,
      imports: options.imports,
      providers: [jwtModuleOptionsProvider]
    };
  }

  static async getPublicKeyHelper(publicKeyURL: string, httpService: HttpService): Promise<string> {
    if (this.publicKey) {
      return this.publicKey;
    }

    const publicKeyResponse = await firstValueFrom(httpService.get(publicKeyURL));
    // Cache the response
    this.publicKey = publicKeyResponse.data[0];
    return this.publicKey;
  }
}
