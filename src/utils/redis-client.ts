import { createClient, RedisClient } from 'redis';
import { promisify } from 'util';

// Utils
import { getEnv } from './';

const redisClient: RedisClient = createClient({
  url: getEnv('REDIS_URL'),
  password: getEnv('REDIS_PASSWORD'),
});

export default {
  ...redisClient,
  getAsync: promisify(redisClient.get).bind(redisClient),
  hgetAsync: promisify(redisClient.hget).bind(redisClient),
  setAsync: promisify(redisClient.set).bind(redisClient),
  setexAsync: promisify(redisClient.setex).bind(redisClient),
  hsetAsync: promisify(redisClient.hset).bind(redisClient),
  keysAsync: promisify(redisClient.keys).bind(redisClient),
  delAsync: promisify(redisClient.del).bind(redisClient),
};
