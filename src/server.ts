import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';

// Config
import {
  API_PORT,
  BASE_PATH,
  COOKIE_SECRET,
  MONGODB_URI,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} from '@/config';

// Middlewares
import { errorHandler } from '@/middlewares';

// Utils
import { getEnv } from './utils';

// Routes
import MainRouter from './routes';

const app = express();
const server = createServer(app);
const port = API_PORT || 3000;

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
      'https://sundayx.tech',
    ],
  }),
);
app.use(cookieParser(COOKIE_SECRET));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (_, res) => {
  return res.status(301).redirect(BASE_PATH);
});

app.use(BASE_PATH, MainRouter);

app.use((_, __, next) => {
  return next(createError(404, 'Route not found!'));
});

app.use(errorHandler);

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
        `SundayX API is running\nPORT\t=>\t${port}\nSERVICE\t=>\tTODO\nENV\t=>\t${getEnv(
          'NODE_ENV',
        ).toUpperCase()}`,
      );
    });
  })();
}

export default server;
