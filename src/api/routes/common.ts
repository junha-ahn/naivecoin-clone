import { Router, Request, Response } from 'express';
import container from '../middlewares/container'
import { Result } from '../../types';
import blockchainService from '../../services/blockchain'

const route = Router();

export default (app: Router) => {
  app.use('/', route);

  route.get('/', container(async (req): Promise<Result> => {
    return {
      httpCode: 200,
      message: 'hello World'
    }
  }));
  
  route.get('/version', container(async (req): Promise<Result> => {
    return {
      httpCode: 200,
      data: blockchainService.getCurrentVersion(),
    }
  }));

  route.get('/blocks', container(async (req): Promise<Result> => {
    return {
      httpCode: 200,
      data: blockchainService.getBlockChain(),
    }
  }));
  
  route.post('/mineBlock', container(async (req): Promise<Result> => {
    const data = req.body.data || [];
    const newBlock = blockchainService.generateNextBlock(data)
    blockchainService.addBlock(newBlock);
    return {
      httpCode: 200,
      data: newBlock ,
    }
  }));
};
