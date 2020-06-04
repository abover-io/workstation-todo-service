export default function decideMongoURI(
  env?: 'development' | 'test' | 'production' | string
) {
  const defaultMongoURI = 'mongodb://mongodb:27017/fancy-todo-api';
  const arg = env || process.env.NODE_ENV;
  switch (arg) {
    case 'development':
      return `${defaultMongoURI}-dev`;

    case 'test':
      return `${defaultMongoURI}-test`;

    default:
      return defaultMongoURI;
  }
}
