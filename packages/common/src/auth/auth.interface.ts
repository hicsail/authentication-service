import { ModuleMetadata } from '@nestjs/common';
import { JwtModuleOptions } from '@nestjs/jwt';
import { Algorithm } from 'jsonwebtoken';

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
