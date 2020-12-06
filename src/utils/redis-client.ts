import { createClient, RedisClient } from 'redis';
import { promisify } from 'util';

// Utils
import { getEnv } from './';

const redisClient: RedisClient = createClient({
  url: getEnv('REDIS_URL'),
  password: getEnv('REDIS_PASSWORD'),
});

function delAsync(...keys: string[]): Promise<number | Error | null> {
  return new Promise((resolve, reject) => {
    redisClient.del(...keys, (err, reply) => {
      if (err) return reject(err);

      return resolve(reply);
    });
  });
}

export default {
  ...redisClient,
  getAsync: promisify(redisClient.get).bind(redisClient),
  hgetAsync: promisify(redisClient.hget).bind(redisClient),
  setAsync: promisify(redisClient.set).bind(redisClient),
  setexAsync: promisify(redisClient.setex).bind(redisClient),
  hsetAsync: promisify(redisClient.hset).bind(redisClient),
  keysAsync: promisify(redisClient.keys).bind(redisClient),
  endAsync: promisify(redisClient.end).bind(redisClient),
  quitAsync: promisify(redisClient.quit).bind(redisClient),
  delAsync,
};
