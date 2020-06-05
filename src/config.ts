import { getEnvVar } from './utils';

export const apiVersion = 'v1';

export const defaultTestPort: number | any =
  getEnvVar('DEFAULT_TEST_PORT') || 4000;

export const JWT_ACCESS_SECRET: string = getEnvVar('JWT_ACCESS_SECRET');

export const JWT_REFRESH_SECRET: string = getEnvVar('JWT_REFRESH_SECRET');

export const JWT_API_KEY_SECRET: string = getEnvVar('JWT_API_KEY_SECRET');
