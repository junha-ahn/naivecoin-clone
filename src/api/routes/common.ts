import { Router, Request, Response } from 'express';
import container from '../middlewares/container'
const route = Router();

export default (app: Router) => {
  app.use('/', route);

  route.get('/', container(async (res) => {
    return {
      httpCode: 200,
      message: 'Hello World'
    }
  }));
};
