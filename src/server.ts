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
} from './config';

// Middlewares
import { errorHandler } from '@/middlewares';

// Utils
import { getEnv } from './utils';

// Routes
import MainRouter from './routes';

const app = express();
const server = createServer(app);
const port = API_PORT;

app.set('trust proxy', true);

app.use(morgan('combined'));
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: [
      'http://127.0.0.1:8010',
      'http://localhost:8010',
      'https://127.0.0.1:8010',
      'https://localhost:8010',
      'https://todo.sundayx.tech',
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
      dbName: DB_NAME,
      user: DB_USER,
      pass: DB_PASSWORD,
    });

    server.listen(port, () => {
      console.log(
        `Name\t=>\tSunday Todo API\nPort\t=>\t${port}\nEnv\t=>\t${getEnv(
          'NODE_ENV',
        )}`,
      );
    });
  })();
}

export default server;
