import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { Server } from 'http';

import mainRouter from './routes';
import { getEnvVar, startAPI } from './utils';

if (process.env.NODE_ENV != 'production') {
  config();
}

const app = express();
const port: number = +process.env.PORT! || 3000;

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:8080', 'https://todo.sundayexplore.tech'],
  }),
);
app.use(cookieParser(getEnvVar('COOKIE_SECRET')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(mainRouter);

const server: Server = new Server(app);

process.env.NODE_ENV !== 'test'
  ? startAPI(server, {
      port,
      env: process.env.NODE_ENV || 'development',
    })
  : '';

export default server;
