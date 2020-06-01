import fs from 'fs';

export default function getEnvVar(
  name: string,
  devEnv?: 'docker' | 'kubernetes' | 'travis' | undefined
) {
  return fs.readFileSync(process.env[name]!, 'utf-8');
}
