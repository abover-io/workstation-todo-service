import fs from 'fs';
import dotenv from 'dotenv';

process.env.NODE_ENV?.toLowerCase() !== 'production' ? dotenv.config() : '';

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
