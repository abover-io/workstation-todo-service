import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import socketIo from 'socket.io';
import helmet from 'helmet';
import morgan from 'morgan';

import {
  API_PORT,
  COOKIE_SECRET,
  MONGODB_URI,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} from '@/config';

import mainRouter from './routes';
import { getEnv } from './utils';
import { IRequestIO } from './typings';

const app = express();
const server = createServer(app);
const port = API_PORT || 3000;
const io = socketIo(server, { serveClient: false });

app.set('trust proxy', true);

app.use(morgan('common'));
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: [
      'http://127.0.0.1:8000',
      'http://localhost:8000',
      'https://127.0.0.1:8000',
      'https://localhost:8000',
      'https://todo.sundayx.tech',
    ],
  }),
);
app.use(cookieParser(COOKIE_SECRET));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  (req as IRequestIO).io = io;
  next();
});

app.use(mainRouter);

if (require.main === module) {
  (async function () {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
      dbName: DB_NAME,
      user: DB_USER,
      pass: DB_PASSWORD,
    });

    server.listen(port, () => {
      console.log(
        `Sunday's Fancy Todo API is running.\nPORT\t=>\t${port}\nENV\t=>\t${getEnv(
          'NODE_ENV',
        ).toUpperCase()}`,
      );
    });
  })();
}

export default server;
