import * as WebSocket from 'ws'
import * as _ from 'lodash'
import * as random from 'random'

import config from '../config'
import Logger from '../loaders/logger';
import BlockchainService from './blockchain'

const MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2,
}
const sockets = []

const initP2PServer = () => {
  const server = new WebSocket.Server({ port: config.port.p2p })
  server.on("connection", (ws) => initConnection(ws))
  Logger.info(`
    #############################################################
    🛡️  webSocket Server listening on port: ${config.port.p2p} 🛡️ 
    #############################################################
  `);
}

const write = (ws, message) => ws.send(JSON.stringify(message))
const broadcast = message => _.forEach(sockets, socket => write(socket, message))
const queryAllMsg = () => ({ type: MessageType.QUERY_ALL })
const queryChainLengthMsg = () => ({ type: MessageType.QUERY_LATEST })
const responseChainMsg = () => ({ type: MessageType.RESPONSE_BLOCKCHAIN, data: JSON.stringify(BlockchainService.getBlockChain())})
const responseLatestMsg = () => ({ type: MessageType.RESPONSE_BLOCKCHAIN, data: JSON.stringify([BlockchainService.getLatestBlock()])})
const replaceChain = newBlocks => {
  const blockchain = BlockchainService.getBlockChain()
  if (BlockchainService.isVaildChain(newBlocks) && newBlocks.length >= blockchain.length && random.boolean()) {
    Logger.info('Received blockchain is vaild. Replacing current blockchain with received blockchain!')
    BlockchainService.setBlockChain(newBlocks)
    broadcast(responseLatestMsg())
  } else {
    Logger.info('Received blockchain invaild')
  }
}
const handleBlockchainResponse = message => {
  const receivedBlocks = JSON.parse(message.data)
  const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1]
  const latestBlockHeld = BlockchainService.getLatestBlock()

  if (latestBlockReceived.header.index > latestBlockHeld.header.index) {
    Logger.info(`Blockchain possibly behind. We got: ${latestBlockHeld.header.index} Peer got: ${latestBlockReceived.header.index}`)
    if (BlockchainService.caclulateHashForBlock(latestBlockHeld) === latestBlockReceived.header.previousHash) {
      Logger.info('we can append the recived block to our chain')
      if (BlockchainService.addBlock(latestBlockReceived)) broadcast(responseLatestMsg())
    } else if (receivedBlocks.length === 1) {
      Logger.info('we have to query the chain from our peer')
      broadcast(queryAllMsg())
    } else {
      Logger.info('Received blockchain is longer than current blockchain')
      replaceChain(receivedBlocks);
    }
  } else {
    Logger.info('Received blockchain is not longer than current blockchain. Do nothing')
  }
}
const closeConnection = ws => {
  Logger.info(`Connection failed to perr: ${ws.url}`)
  sockets.splice(sockets.indexOf(ws), 1)
}
const initErrorHandler = ws => {
  ws.on('close', () => closeConnection(ws))
  ws.on('error', () => closeConnection(ws))
}
const initMessageHandler = ws => ws.on("message", data => {
  const message = JSON.parse(data);

  switch (message.type) {
    case MessageType.QUERY_LATEST:
      write(ws, responseLatestMsg())
      break
    case MessageType.QUERY_ALL:
      write(ws, responseChainMsg())
      break
    case MessageType.RESPONSE_BLOCKCHAIN:
      handleBlockchainResponse(message)
      break;
  }
})

const initConnection = ws => {
  sockets.push(ws)
  initMessageHandler(ws)
  initErrorHandler(ws)
  write(ws, queryChainLengthMsg())
}
initP2PServer()

export default class SocketService {
  static getSockets = () => sockets
  static connectToPeers = (newPeers) => {
    _.forEach(newPeers, perr => {
      const ws = new WebSocket(perr);
      ws.on('open', () => initConnection(ws))
      ws.on('error', () => Logger.error('Connection failed'))
    })
  }
  static mineBlcok = blockData => {
    const newBlock = BlockchainService.generateNextBlock(blockData)
    if (BlockchainService.addBlock(newBlock)) {
      broadcast(responseLatestMsg())
      return newBlock
    }
  }
}