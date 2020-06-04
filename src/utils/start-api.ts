import { Express } from 'express';
import { Server } from 'http';
import { connect as connectToMongoDB } from 'mongoose';

import { IStartApiOptions } from '@/types';
import { decideMongoURI } from '@/utils';

export default async function startAPI(
  app: Express | Server,
  options?: IStartApiOptions
): Promise<void> {
  const { port = 3000, env = process.env.NODE_ENV || 'development' } = options!;

  try {
    await connectToMongoDB(process.env.MONGODB_URI || decideMongoURI(env), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(port, () => {
      console.log(
        `Sunday's Fancy Todo API is running.\nPORT\t=>\t${port}\nENV\t=>\t${process.env.NODE_ENV}`
      );
    });
  } catch (err) {
    console.log(err.message);
  }
}
