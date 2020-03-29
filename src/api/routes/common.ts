import * as _ from 'lodash'
import { Router } from 'express';
import container from '../middlewares/container'
import { Result } from '../../types';
import BlockchainService from '../../services/blockchain'
import SocketService from '../../services/socket'
import { Socket } from 'dgram';

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
      data: BlockchainService.getBlockChain(),
    }
  }));

  route.get('/peers', container(async (req): Promise<Result> => {
    return {
      httpCode: 200,
      data: _.map(SocketService.getSockets(), s => ({
        remoteAddress: s._socket.remoteAddress,
        remotePort: s._socket.remotePort,
      })),
    }
  }));
  route.post('/addPeers', container(async (req): Promise<Result> => {
    const peers = req.body.peers || []
    SocketService.connectToPeers(peers)
    return {
      httpCode: 200,
    }
  }));
  
  route.post('/mineBlock', container(async (req): Promise<Result> => {
    const data = req.body.data || [];
    const newBlock = SocketService.mineBlcok(data)
    if (!newBlock) {
      return {
        httpCode: 400,
        message: '발행 실패',
      }
    }
    return {
      httpCode: 200,
      data: newBlock ,
    }
  }));

};
