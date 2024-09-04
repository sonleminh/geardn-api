import { registerAs } from '@nestjs/config';

export enum DbConfigKey {
  MONGO_HOST = 'MONGO_HOST',
  MONGO_USER = 'MONGO_USER',
  MONGO_PASSWORD = 'MONGO_PASSWORD',
}

export type IDbConfig = {
  [DbConfigKey.MONGO_HOST]: string | undefined;
  [DbConfigKey.MONGO_USER]: string | undefined;
  [DbConfigKey.MONGO_PASSWORD]: string | undefined;
};

export default registerAs('', () => ({
  [DbConfigKey.MONGO_HOST]: process.env[DbConfigKey.MONGO_HOST],
  [DbConfigKey.MONGO_USER]: process.env[DbConfigKey.MONGO_USER],
  [DbConfigKey.MONGO_PASSWORD]: process.env[DbConfigKey.MONGO_PASSWORD],
}));