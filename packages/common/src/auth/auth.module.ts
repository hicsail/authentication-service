import { HttpModule, HttpService } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { Algorithm } from 'jsonwebtoken';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';

export interface AuthModuleOptions {
  /** URL to get the public key from */
  publicKeyURL: string;
  /** The sign algorithm being used */
  signAlgorithm: Algorithm;
}

export const AUTH_MODULE_OPTIONS = 'AUTH_MODULE_OPTIONS';

@Module({})
export class AuthModule {
  private static publicKey: string | null = null;


  static register(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        this.getJwtModule(options)
      ],
      providers: [
        JwtAuthGuard,
        {
          provide: JwtStrategy,
          inject: [HttpService],
          useFactory: async(httpService: HttpService) => new JwtStrategy(await this.getPublicKey(options, httpService)),
        }
      ],
      exports: [JwtAuthGuard]
    };
  }

  /** Make the JWT module, grabbing the public key from the provided URL */
  private static getJwtModule(options: AuthModuleOptions): DynamicModule {
    return JwtModule.registerAsync({
      imports: [HttpModule],
      inject: [HttpService],
      useFactory: async (httpService: HttpService) => ({
        publicKey: await this.getPublicKey(options, httpService),
        signOptions: {
          algorithm: options.signAlgorithm
        }
      })
    })
  }

  private static async getPublicKey(options: AuthModuleOptions, httpService: HttpService): Promise<string> {
    if (this.publicKey) {
      return this.publicKey;
    }

    const publicKeyResponse = await firstValueFrom(httpService.get(options.publicKeyURL));
    // Cache the response
    this.publicKey = publicKeyResponse.data[0];
    return this.publicKey;
  }
}
