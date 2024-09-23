import { registerAs } from "@nestjs/config";

export enum FirebaseConfigKey {
  TYPE = 'TYPE',
  PROJECT_ID = 'PROJECT_ID',
  PRIVATE_KEY_ID = 'PRIVATE_KEY_ID',
  PRIVATE_KEY = 'PRIVATE_KEY',
  CLIENT_EMAIL = 'CLIENT_EMAIL',
  CLIENT_ID = 'CLIENT_ID',
  AUTH_URI = 'AUTH_URI',
  TOKEN_URI = 'TOKEN_URI',
  AUTH_CERT_URL = 'AUTH_CERT_URL',
  CLIENT_CERT_URL = 'CLIENT_CERT_URL',
  UNIVERSAL_DOMAIN = 'UNIVERSAL_DOMAIN',
}

export type IFirebaseConfig = {
  [FirebaseConfigKey.TYPE]: string | undefined;
  [FirebaseConfigKey.PROJECT_ID]: string | undefined;
  [FirebaseConfigKey.PRIVATE_KEY_ID]: string | undefined;
  [FirebaseConfigKey.PRIVATE_KEY]: string | undefined;
  [FirebaseConfigKey.CLIENT_EMAIL]: string | undefined;
  [FirebaseConfigKey.CLIENT_ID]: string | undefined;
  [FirebaseConfigKey.AUTH_URI]: string | undefined;
  [FirebaseConfigKey.TOKEN_URI]: string | undefined;
  [FirebaseConfigKey.AUTH_CERT_URL]: string | undefined;
  [FirebaseConfigKey.CLIENT_CERT_URL]: string | undefined;
  [FirebaseConfigKey.UNIVERSAL_DOMAIN]: string | undefined;
};

export default registerAs('', () => ({
  [FirebaseConfigKey.TYPE]: process.env[FirebaseConfigKey.TYPE],
  [FirebaseConfigKey.PROJECT_ID]: process.env[FirebaseConfigKey.PROJECT_ID],
  [FirebaseConfigKey.PRIVATE_KEY_ID]: process.env[FirebaseConfigKey.PRIVATE_KEY_ID],
  [FirebaseConfigKey.PRIVATE_KEY]: process.env[FirebaseConfigKey.PRIVATE_KEY],
  [FirebaseConfigKey.CLIENT_EMAIL]: process.env[FirebaseConfigKey.CLIENT_EMAIL],
  [FirebaseConfigKey.CLIENT_ID]: process.env[FirebaseConfigKey.CLIENT_ID],
  [FirebaseConfigKey.AUTH_URI]: process.env[FirebaseConfigKey.AUTH_URI],
  [FirebaseConfigKey.TOKEN_URI]: process.env[FirebaseConfigKey.TOKEN_URI],
  [FirebaseConfigKey.AUTH_CERT_URL]: process.env[FirebaseConfigKey.AUTH_CERT_URL],
  [FirebaseConfigKey.CLIENT_CERT_URL]: process.env[FirebaseConfigKey.CLIENT_CERT_URL],
  [FirebaseConfigKey.UNIVERSAL_DOMAIN]: process.env[FirebaseConfigKey.UNIVERSAL_DOMAIN],
}));

// export const firebaseConfig = {
//   type: configService.get<string>('TYPE'),
//   project_id: configService.get<string>('PROJECT_ID'),
//   private_key_id: configService.get<string>('PRIVATE_KEY_ID'),
//   private_key: configService.get<string>('PRIVATE_KEY'),
//   client_email: configService.get<string>('CLIENT_EMAIL'),
//   client_id: configService.get<string>('CLIENT_ID'),
//   auth_uri: configService.get<string>('AUTH_URI'),
//   token_uri: configService.get<string>('TOKEN_URI'),
//   auth_provider_x509_cert_url: configService.get<string>('AUTH_CERT_URL'),
//   client_x509_cert_url: configService.get<string>('CLIENT_CERT_URL'),
//   universe_domain: configService.get<string>('UNIVERSAL_DOMAIN'),
// };
