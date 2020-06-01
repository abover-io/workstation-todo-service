import fs from 'fs';

export const decideMongoURI = (
  env?: 'development' | 'test' | 'production' | undefined
) => {
  const defaultMongoURI = 'mongodb://fancy-todo-mongodb:27017/fancy-todo-api';
  const arg = env || process.env.NODE_ENV;
  switch (arg) {
    case 'development':
      return `${defaultMongoURI}-dev`;

    case 'test':
      return `${defaultMongoURI}-test`;

    default:
      return defaultMongoURI;
  }
};

export const defaultTestPort: number | any =
  4000 || process.env.DEFAULT_TEST_PORT;

export const JWT_ACCESS_SECRET: string = fs.readFileSync(
  process.env.JWT_ACCESS_SECRET!,
  'utf-8'
);

export const JWT_REFRESH_SECRET: string = fs.readFileSync(
  process.env.JWT_REFRESH_SECRET!,
  'utf-8'
);

export const JWT_API_KEY_SECRET: string = fs.readFileSync(
  process.env.JWT_API_KEY_SECRET!,
  'utf-8'
);
