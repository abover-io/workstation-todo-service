import { getEnv } from './utils';

export const apiVersion = 'v1';

export const NODE_ENV: string = getEnv('NODE_ENV');

export const API_PORT: number = getEnv('PORT');

export const MONGODB_URI: string = getEnv('MONGODB_URI');

export const MONGODB_CONTAINER: string = getEnv('MONGODB_CONTAINER');

export const defaultTestPort: number | any =
  getEnv('DEFAULT_TEST_PORT') || 4000;

export const COOKIE_SECRET: string = getEnv('COOKIE_SECRET');

export const JWT_ACCESS_SECRET: string = getEnv('JWT_ACCESS_SECRET');

export const JWT_REFRESH_SECRET: string = getEnv('JWT_REFRESH_SECRET');

export const JWT_API_KEY_SECRET: string = getEnv('JWT_API_KEY_SECRET');

export const GOOGLE_OAUTH_CLIENT_ID: string = getEnv('GOOGLE_OAUTH_CLIENT_ID');

export const GOOGLE_OAUTH_CLIENT_SECRET: string = getEnv('GOOGLE_OAUTH_CLIENT_SECRET');
