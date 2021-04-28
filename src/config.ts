import { getEnv } from './utils';

// Node.js Config
export const NODE_ENV: string = getEnv('NODE_ENV');

// API Config
export const API_PORT: number = getEnv('API_PORT');
export const BASE_PATH: string = '/api/todo/v1';

// DB Config
export const MONGODB_URI: string = getEnv('MONGODB_URI');
export const DB_NAME: string = getEnv('DB_NAME');
export const DB_USER: string = getEnv('DB_USER');
export const DB_PASSWORD: string = getEnv('DB_PASSWORD');

// Cookie Config
export const COOKIE_SECRET: string = getEnv('COOKIE_SECRET');

// JWT Config
export const JWT_ACCESS_SECRET: string = getEnv('JWT_ACCESS_SECRET');
export const JWT_REFRESH_SECRET: string = getEnv('JWT_REFRESH_SECRET');
export const JWT_API_KEY_SECRET: string = getEnv('JWT_API_KEY_SECRET');

// Redis Config
export const REDIS_HOST: string = getEnv('REDIS_HOST');
export const REDIS_PASSWORD: string = getEnv('REDIS_PASSWORD');

// Google OAuth Web Config
export const GOOGLE_OAUTH_WEB_CLIENT_ID: string = getEnv(
  'GOOGLE_OAUTH_WEB_CLIENT_ID',
);
export const GOOGLE_OAUTH_WEB_CLIENT_SECRET: string = getEnv(
  'GOOGLE_OAUTH_WEB_CLIENT_SECRET',
);
