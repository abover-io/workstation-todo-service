import { Server } from 'http';
import { connect as connectToMongoDB } from 'mongoose';

import { IStartApiOptions } from '@/types';
import { decideMongoURI } from '@/utils';

export default async function startAPI(
  api: Server,
  options: IStartApiOptions = {
    port: 3000,
    env: process.env.NODE_ENV || 'development',
  }
): Promise<void> {
  const { port, env } = options;

  try {
    await connectToMongoDB(process.env.MONGODB_URI || decideMongoURI(env), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    api.listen(port, () => {
      console.log(
        `Sunday's Fancy Todo API is running.\nPORT\t=>\t${port}\nENV\t=>\t${env.toUpperCase()}`
      );
    });

    api.on('error', () => {
      api.close();
    });
  } catch (err) {
    console.error(err);
  }
}
