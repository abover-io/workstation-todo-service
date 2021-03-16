import { getEnv } from './utils';

// Node.js Configs
export const NODE_ENV: string = getEnv('NODE_ENV');

// API Configs
export const API_PORT: number = getEnv('API_PORT');
export const BASE_PATH: string = '/api/v1';

// DB Configs
export const MONGODB_URI: string = getEnv('MONGODB_URI');
export const DB_NAME: string = getEnv('DB_NAME');
export const DB_USER: string = getEnv('DB_USER');
export const DB_PASSWORD: string = getEnv('DB_PASSWORD');

// Cookie Configs
export const COOKIE_SECRET: string = getEnv('COOKIE_SECRET');

// JWT Configs
export const JWT_ACCESS_SECRET: string = getEnv('JWT_ACCESS_SECRET');
export const JWT_REFRESH_SECRET: string = getEnv('JWT_REFRESH_SECRET');
export const JWT_API_KEY_SECRET: string = getEnv('JWT_API_KEY_SECRET');

// Google OAuth Web Configs
export const GOOGLE_OAUTH_WEB_CLIENT_ID: string = getEnv(
  'GOOGLE_OAUTH_WEB_CLIENT_ID',
);
export const GOOGLE_OAUTH_WEB_CLIENT_SECRET: string = getEnv(
  'GOOGLE_OAUTH_WEB_CLIENT_SECRET',
);
