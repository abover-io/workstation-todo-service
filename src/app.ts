import fs from 'fs';
import express from 'express';
import { connect as connectToMongoDB } from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config as dotEnvConfig } from 'dotenv';
import { createServer, Server } from 'https';
import socketIo from 'socket.io';
import helmet from 'helmet';

import mainRouter from './routes';
import { getEnvVar } from './utils';
import { IRequestIO } from './types';

process.env.NODE_ENV !== 'production' ? dotEnvConfig() : '';

const privateKey: string = fs.readFileSync('../ssl/key.pem', 'utf8');
const certificate: string = fs.readFileSync('../ssl/cert.pem', 'utf8');

const port: number = +process.env.PORT! || 443;
const app = express();
const server: Server = createServer({
  key: privateKey,
  cert: certificate
}, app);
const io = socketIo(server, { serveClient: false });

app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:8080', 'https://todo.sundayexplore.tech'],
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

if (require.main !== module) {
  (async function () {
    await connectToMongoDB(process.env.MONGODB_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    server.listen(port, () => {
      console.log(
        `Sunday's Fancy Todo API is running.\nPORT\t=>\t${port}\nENV\t=>\t${process.env.NODE_ENV!.toUpperCase()}`,
      );
    });
  })();
}

export default server;
