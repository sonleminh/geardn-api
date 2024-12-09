import { registerAs } from '@nestjs/config';

export enum AppConfigKey {
  APP_PREFIX = 'API_PREFIX',
  PORT = 'PORT',
  WHITE_LIST = 'WHITE_LIST',
}

export type IAppConfig = {
  [AppConfigKey.APP_PREFIX]: string;
  [AppConfigKey.PORT]: string;
  [AppConfigKey.WHITE_LIST]: string;
};

export default registerAs('', () => ({
  [AppConfigKey.APP_PREFIX]: process.env[AppConfigKey.APP_PREFIX],
  [AppConfigKey.PORT]: process.env[AppConfigKey.PORT],
  [AppConfigKey.WHITE_LIST]: process.env[AppConfigKey.WHITE_LIST],
}));
