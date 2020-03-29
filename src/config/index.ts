import * as dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
 

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: {
    web: Number(process.env.PORT || 3000),
    p2p: Number(process.env.P2P_PORT  || 3001)
  },
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  api: {
    prefix: '/'
  }
};
