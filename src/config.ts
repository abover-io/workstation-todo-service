import { getEnvVar } from './utils';

export const apiVersion = 'v1';

export const NODE_ENV: string = getEnvVar('NODE_ENV');

export const API_PORT: number = getEnvVar('PORT');

export const MONGODB_URI: string = getEnvVar('MONGODB_URI');

export const MONGODB_CONTAINER: string = getEnvVar('MONGODB_CONTAINER');

export const defaultTestPort: number | any =
  getEnvVar('DEFAULT_TEST_PORT') || 4000;

export const COOKIE_SECRET: string = getEnvVar('COOKIE_SECRET');

export const JWT_ACCESS_SECRET: string = getEnvVar('JWT_ACCESS_SECRET');

export const JWT_REFRESH_SECRET: string = getEnvVar('JWT_REFRESH_SECRET');

export const JWT_API_KEY_SECRET: string = getEnvVar('JWT_API_KEY_SECRET');

export const GOOGLE_OAUTH_CLIENT_ID: string = getEnvVar('GOOGLE_OAUTH_CLIENT_ID');

export const GOOGLE_OAUTH_CLIENT_SECRET: string = getEnvVar('GOOGLE_OAUTH_CLIENT_SECRET');
