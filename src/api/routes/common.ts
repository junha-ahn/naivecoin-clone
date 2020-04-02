import * as _ from 'lodash'
import {
  Router
} from 'express';
import container from '../middlewares/container'
import {
  Result
} from '../../types';
import Logger from '../../loaders/logger'
import * as BlockcahinService from '../../services/blockchain'
import * as SocketService from '../../services/socket'
import * as WalletService from '../../services/wallet';

const route = Router();

WalletService.initWallet()
Logger.info('public key :' + WalletService.getPublicFromWallet())
export default (app: Router) => {
  app.use('/', route);

  route.get('/blocks', container(async (req): Promise < Result > => {
    return {
      httpCode: 200,
      data: BlockcahinService.getBlockchain(),
    }
  }));

  route.get('/peers', container(async (req): Promise < Result > => {
    return {
      httpCode: 200,
      data: _.map(SocketService.getSockets(), s => ({
        remoteAddress: s._socket.remoteAddress,
        remotePort: s._socket.remotePort,
      })),
    }
  }));
  route.post('/addPeers', container(async (req): Promise < Result > => {
    const peers = req.body.peers || []
    SocketService.connectToPeers(peers)
    return {
      httpCode: 200,
    }
  }));

  route.post('/mineBlock', container(async (req): Promise < Result > => {
    const {
      data
    } = req.body
    if (data == null) {
      return {
        httpCode: 401,
        message: 'body invaild',
      }
    }
    const newBlock = BlockcahinService.generateNextBlock(data);
    if (!newBlock) {
      return {
        httpCode: 400,
        message: '발행 실패',
      }
    }
    return {
      httpCode: 200,
      data: newBlock,
    }
  }));

  app.post('/mineTransaction', (req, res) => {
    const address = req.body.address;
    const amount = req.body.amount;
    // blockchain.ts 에 이번 단계에서 새로 추가된 generatenextBlockWithTransaction 으로 resp 생성
    const resp = BlockcahinService.generatenextBlockWithTransaction(address, amount);

    return {
      httpCode: 200,
      data: resp,
    }
  });
};