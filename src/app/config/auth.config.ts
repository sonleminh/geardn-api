import { registerAs } from '@nestjs/config';

export enum AuthConfigKey {
  AT_SECRET = 'AT_SECRET',
  // RT_SECRET = 'RT_SECRET',
  // CK_PATH = 'CK_PATH',
  // CK_SECRET = 'CK_SECRET',
  JWT_SECRET_KEY = 'JWT_SECRET_KEY',
  // RT_SECRET_KEY = 'RT_SECRET_KEY',
}

export type IAuthConfig = {
  [AuthConfigKey.AT_SECRET]: string;
  // [AuthConfigKey.RT_SECRET]: string;
  // [AuthConfigKey.CK_PATH]: string;
  // [AuthConfigKey.CK_SECRET]: string;
  [AuthConfigKey.JWT_SECRET_KEY]: string;
  // [AuthConfigKey.RT_SECRET_KEY]: string;
};

export default registerAs('', () => ({
  [AuthConfigKey.AT_SECRET]: process.env[AuthConfigKey.AT_SECRET],
  // [AuthConfigKey.RT_SECRET]: process.env[AuthConfigKey.RT_SECRET],
  // [AuthConfigKey.CK_PATH]: process.env[AuthConfigKey.CK_PATH],
  // [AuthConfigKey.CK_SECRET]: process.env[AuthConfigKey.CK_SECRET],
  [AuthConfigKey.JWT_SECRET_KEY]: process.env[AuthConfigKey.JWT_SECRET_KEY],
  // [AuthConfigKey.RT_SECRET_KEY]: process.env[AuthConfigKey.RT_SECRET_KEY],
}));
