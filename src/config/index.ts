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
  },
  // 블록 생성 주기. in seconds
  BLOCK_GENERATION_INTERVAL:  10,
  // 난이도 조정 주기. in blocks
  DIFFICULTY_ADJUSTMENT_INTERVAL: 10,
};
