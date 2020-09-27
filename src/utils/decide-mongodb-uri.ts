import { NODE_ENV, MONGODB_CONTAINER } from '@/config';

export default function decideMongoDBURI(
  env?: 'development' | 'test' | 'production' | string,
) {
  const defaultMongoURI = `mongodb://${
    MONGODB_CONTAINER || 'localhost'
  }:27017/fancy-todo`;
  switch (env || NODE_ENV) {
    case 'development':
      return `${defaultMongoURI}-dev`;

    case 'test':
      return `${defaultMongoURI}-test`;

    default:
      return defaultMongoURI;
  }
}
