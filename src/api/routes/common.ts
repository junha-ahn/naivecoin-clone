import { Router, Request, Response } from 'express';
const route = Router();

export default (app: Router) => {
  app.use('/', route);

  route.get('/', (req: Request, res: Response) => {
    return res.status(200).send('hello World')
  });
};
