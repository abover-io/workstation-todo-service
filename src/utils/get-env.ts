import fs from 'fs';
import { config as dotEnvConfig } from 'dotenv';

process.env.NODE_ENV?.toLowerCase() !== 'production' ? dotEnvConfig() : '';

export default function getEnv(name: string): string | any {
  try {
    if (process.env[name]?.includes('/run/secrets')) {
      return fs.readFileSync(process.env[name]!, { encoding: 'utf-8' }).trim();
    }

    return process.env[name];
  } catch (err) {
    return process.env[name];
  }
}
