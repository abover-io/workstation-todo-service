import { createClient } from 'redis';
import { promisify } from 'util';

// Config
import { REDIS_HOST, REDIS_PASSWORD } from '@/config';

const redis = createClient({
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
});

function delAsync(...keys: string[]): Promise<number | Error | null | void> {
  return new Promise((resolve, reject) => {
    if (keys.length) {
      redis.del(keys, (err, reply) => {
        if (err) return reject(err);

        return resolve(reply);
      });
    } else {
      return resolve();
    }
  });
}

export default {
  ...redis,
  pingAsync: promisify(redis.ping).bind(redis),
  getAsync: promisify(redis.get).bind(redis),
  hgetAsync: promisify(redis.hget).bind(redis),
  setAsync: promisify(redis.set).bind(redis),
  setexAsync: promisify(redis.setex).bind(redis),
  hsetAsync: promisify(redis.hset).bind(redis),
  keysAsync: promisify(redis.keys).bind(redis),
  endAsync: promisify(redis.end).bind(redis),
  quitAsync: promisify(redis.quit).bind(redis),
  delAsync,
};
