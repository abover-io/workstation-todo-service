import {
  disconnect as disconnectFromMongoDB,
  connection as mongoDbConnection,
} from 'mongoose';
import { Server } from 'http';

import { IStopApiOptions } from '@/types';
import { decideMongoURI } from '@/utils';

export default async function stopAPI(
  api: Server,
  options: IStopApiOptions = {
    env: 'development',
    db: 'hold',
  }
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
      api.close(err => {
        if (err) throw err;
      });
    });
  } catch (err) {
    console.error(err);
  }
}
