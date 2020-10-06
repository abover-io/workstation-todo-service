import {
  disconnect as disconnectFromMongoDB,
  connection as mongoDbConnection,
} from 'mongoose';
import { Server } from 'http';

import { NODE_ENV } from '@/config';
import { IStopApiOptions } from '@/typings';

export default async function stopAPI(
  api: Server,
  options: IStopApiOptions = {
    env: NODE_ENV || 'development',
    db: 'hold',
  },
) {
  const { env, db } = options;

  try {
    switch (env) {
      case 'test':
        if (db == 'drop') {
          await mongoDbConnection.db.dropDatabase();
        }
        break;
    }

    await disconnectFromMongoDB();

    api.on('listening', () => {
      api.close();
    });

    api.on('error', () => {
      api.close();
    });
  } catch (err) {
    console.error(err);
  }
}
