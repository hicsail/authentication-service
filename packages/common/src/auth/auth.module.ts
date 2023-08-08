import { HttpModule, HttpService } from '@nestjs/axios';
import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JWT_MODULE_OPTIONS } from '@nestjs/jwt/dist/jwt.constants';
import { firstValueFrom } from 'rxjs';
import { Algorithm } from 'jsonwebtoken';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';
import { PassportModule } from '@nestjs/passport';

export interface AuthModuleOptions {
  /** URL to get the public key from */
  publicKeyURL: string;
  /** The sign algorithm being used */
  signAlgorithm: Algorithm;
}

export interface AuthModuleOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any) => Promise<JwtModuleOptions>;
  inject?: any[];
}

export const AUTH_MODULE_OPTIONS = 'AUTH_MODULE_OPTIONS';

// TODO: Attempt to have an intermediate module that provides a service
//       which exposes the needed settings

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
        {
          provide: JwtStrategy,
          inject: [HttpService],
          useFactory: async(httpService: HttpService) => new JwtStrategy(await this.getPublicKeyHelper(options.publicKeyURL, httpService)),
        }
      ],
      exports: [JwtAuthGuard]
    };
  }

  static registerAsync(options: AuthModuleOptionsAsync): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        PassportModule,
        HttpModule,
        this.getJwtModuleAsync(options)
      ],
      providers: [
        JwtAuthGuard
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

  private static getJwtModuleAsync(options: AuthModuleOptionsAsync): DynamicModule {
    return {
      module: JwtModule,
      imports: options.imports,
      providers: [
        {
          provide: JWT_MODULE_OPTIONS,
          inject: options.inject,
          useFactory: async () => options.useFactory
        }
      ]
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
