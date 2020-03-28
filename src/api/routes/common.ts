import { Router, Request, Response } from 'express';
import container from '../middlewares/container'
import { Result } from '../../types';
const route = Router();

export default (app: Router) => {
  app.use('/', route);

  route.get('/', container(async (req): Promise<Result> => {
    return {
      httpCode: 200,
      message: 'hello World'
    }
  }));
};
