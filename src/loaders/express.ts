import * as express from 'express';
import * as bodyParser from 'body-parser';
import routes from '../api';
import config from '../config';

export default ({ app }: { app: express.Application }) => {
  app.use(bodyParser.json());
  // Load API routes
  app.use(config.api.prefix, routes());
};
