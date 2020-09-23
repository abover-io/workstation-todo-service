import express from 'express';
import { connect as connectToMongoDB } from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config as dotEnvConfig } from 'dotenv';
import { createServer } from 'http';
import socketIo from 'socket.io';
import helmet from 'helmet';
import morgan from 'morgan';

import mainRouter from './routes';
import { getEnvVar, decideMongoURI } from './utils';
import { IRequestIO } from './types';

getEnvVar('NODE_ENV') !== 'production' ? dotEnvConfig() : '';

const app = express();
const server = createServer(app);
const port = getEnvVar('API_PORT') || 3000;
const io = socketIo(server, { serveClient: false });

app.use(morgan('common'));
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:8000',
      'https://todo.sundayx.tech'
    ]
  }),
);
app.use(cookieParser(getEnvVar('COOKIE_SECRET')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  (req as IRequestIO).io = io;
  next();
});

app.use(mainRouter);

if (require.main === module) {
  (async function () {
    await connectToMongoDB(
      getEnvVar('MONGODB_URI') || decideMongoURI(getEnvVar('NODE_ENV')),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );

    server.listen(port, () => {
      console.log(
        `Sunday's Fancy Todo API is running.\nPORT\t=>\t${port}\nENV\t=>\t${getEnvVar(
          'NODE_ENV',
        ).toUpperCase()}`,
      );
    });
  })();
}

export default server;
