import fs from 'fs';

export default function getEnvVar(
  name: string,
  devEnv?: 'docker' | 'kubernetes' | 'travis' | undefined
) {
  return fs.readFileSync(`/run/secrets/${name}`, 'utf-8');
}
