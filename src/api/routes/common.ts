import * as _ from 'lodash'
import { Router } from 'express';
import container from '../middlewares/container'
import { Result } from '../../types';
import {Block, generateNextBlock, getBlockchain} from '../../services/blockchain'
import {connectToPeers, getSockets}  from '../../services/socket'
import { Socket } from 'dgram';

const route = Router();

export default (app: Router) => {
  app.use('/', route);
  
  route.get('/blocks', container(async (req): Promise<Result> => {
    return {
      httpCode: 200,
      data: getBlockChain(),
    }
  }));

  route.get('/peers', container(async (req): Promise<Result> => {
    return {
      httpCode: 200,
      data: _.map(getSockets(), s => ({
        remoteAddress: s._socket.remoteAddress,
        remotePort: s._socket.remotePort,
      })),
    }
  }));
  route.post('/addPeers', container(async (req): Promise<Result> => {
    const peers = req.body.peers || []
    connectToPeers(peers)
    return {
      httpCode: 200,
    }
  }));
  
  route.post('/mineBlock', container(async (req): Promise<Result> => {
    const newBlock: Block = generateNextBlock(req.body.data);
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
