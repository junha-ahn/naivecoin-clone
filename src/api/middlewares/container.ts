import * as express from 'express';

import config from '../../config'
import sendResponse from './response'


export default (service: Function) => async (req: express.Request, res: express.Response) => {
  const response = sendResponse(res);
  try {
    const result = await service(req);

    response(result || response({
      message: '반환값이 명시되지 않았습니다'
    }));
  } catch (e) {
    if (config.NODE_ENV !== 'test') console.error(e)
    if (e.status !== undefined) {
      const httpCode = e.httpCode || 500;
      return res.status(httpCode).json(e);
    }
    response(response({
      message: e.message
    }));
  }
};