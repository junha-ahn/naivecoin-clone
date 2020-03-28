import * as dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
 

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: Number(process.env.PORT || 3000),
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  api: {
    prefix: '/'
  }
};
