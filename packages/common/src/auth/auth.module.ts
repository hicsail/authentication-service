import { DynamicModule, Module, ModuleMetadata, ValueProvider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

export interface AuthModuleOptions {
  /**
   * The public key used for JWT verification, required for use by both
   * the client and server
   */
  publicKey: string;
  /**
   * The private key used for JWT creation, only used by the server that
   * mints JWTs
   */
  privateKey?: string;
}

export interface AuthModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<AuthModuleOptions> | AuthModuleOptions;
  inject?: any[];
};

export const AUTH_MODULE_OPTIONS = 'AUTH_MODULE_OPTIONS';

@Module({
  imports: [],
  exports: []
})
export class AuthModule {
  /** Register option when options can be provided directly */
  static register(_options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule
    }
  }

  /** Async option when providing a factory that generates the options */
  static registerAsync(options: AuthModuleAsyncOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: options.imports || [],
      providers: [this.createAsyncOptionsProvider(options)]
    };
  }

  /** Provider that get's options from factory method */
  private static createAsyncOptionsProvider(options: AuthModuleAsyncOptions): ValueProvider<AuthModuleOptions> {
    return {
      provide: AUTH_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || []
    };
  }

  private static getJwtModule(optionsProvider: Provider): DynamicModule {
    return JwtModule.registerAsync({
      useFactory: async () => ({

      })
    });
  }
}
