import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { config } from 'dotenv';

import router from './routes';
import { decideMongoURI } from './config';

if (process.env.NODE_ENV !== 'production') {
  config();
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

mongoose.connect(process.env.MONGODB_URI || decideMongoURI(), {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(port, () => {
  console.log(`Sunday's Fancy Todo API is running on port ${port}! Environment: ${process.env.NODE_ENV?.toUpperCase()}`);
});

export default app;
