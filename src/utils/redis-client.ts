import { createClient } from 'redis';
import { promisify } from 'util';

// Config
import { getEnv } from '@/utils';

const redisClient = createClient({
  host: getEnv('REDIS_HOST'),
  password: getEnv('REDIS_PASSWORD'),
});

function delAsync(...keys: string[]): Promise<number | Error | null | void> {
  return new Promise((resolve, reject) => {
    if (keys.length) {
      redisClient.del(keys, (err, reply) => {
        if (err) return reject(err);

        return resolve(reply);
      });
    } else {
      return resolve();
    }
  });
}

export default {
  ...redisClient,
  pingAsync: promisify(redisClient.ping).bind(redisClient),
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
