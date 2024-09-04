import { registerAs } from '@nestjs/config';

export enum AppConfigKey {
  APP_PREFIX = 'API_PREFIX',
  PORT = 'PORT',
}

export type IAppConfig = {
  [AppConfigKey.APP_PREFIX]: string;
  [AppConfigKey.PORT]: string;
};

export default registerAs('', () => ({
  [AppConfigKey.APP_PREFIX]: process.env[AppConfigKey.APP_PREFIX],
  [AppConfigKey.PORT]: process.env[AppConfigKey.PORT],
}));
