import fs from 'fs';

export default function getEnvVar(
  name: string,
  devEnv?: 'docker' | 'kubernetes' | 'travis' | undefined
): string | any {
  // const defaultEnvVar = process.env[name];

  // if (!defaultEnvVar) {
  //   return fs.readFileSync(process.env[name]! || '', 'utf-8')
  // }

  // return defaultEnvVar;

  switch (devEnv) {
    case 'docker':
      return fs.readFileSync(process.env[name]!, 'utf-8')
  
    default:
      return process.env[name];
  }
}
