import config from './config';
import * as express from 'express';
import Logger from './loaders/logger';

async function startServer() {
  const app = express();
  
  await require('./loaders').default({ expressApp: app });

  app.listen(config.port.web, err => {
    if (err) {
      Logger.error(err);
      process.exit(1);
    }
    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port.web} 🛡️ 
      ################################################
    `);
  });
}

startServer();
