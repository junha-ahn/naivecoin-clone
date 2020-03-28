import * as path from 'path'
import * as fs from 'fs'
import * as CryptoJS from 'crypto-js'
import * as merkle from 'merkle'
import * as _ from 'lodash'

const basicMercleRoot = '0'.repeat(64)
type Blockchain = Block[]
type Version = string
type Hash = string


class BlockHeader {
  constructor(
    public version:Version, 
    public index: number, 
    public previosHash: Hash, 
    public timestamp:number, 
    public merkleRoot: string) {}
}
class Block {
  constructor(public header: BlockHeader, public data: string[]) {}
}

const getCurrentTimestamp = (): number => Math.round(new Date().getTime() / 1000)
const getMerkleRoot = (data): string => {
  const merkleTree= merkle("sha256").sync(data)
  return merkleTree.root() || basicMercleRoot
}
const getGenesisBlock = (): Block => {
  const version: Version = `1.0.0`
  const index: number = 0
  const previosHash: Hash = basicMercleRoot
  const timestamp: number = getCurrentTimestamp()
  const data = [`genesis block`]
  
  const merkleRoot: string = getMerkleRoot(data)
  
  const header = new BlockHeader(version, index, previosHash, timestamp, merkleRoot)
  return new Block(header, data)
}

const caclulateHash = (version: Version, index: number, previosHash: Hash, timestamp: number, merkleRoot: string): Hash => CryptoJS.SHA256(version + index + previosHash + timestamp + merkleRoot).toString()
const caclulateHashForBlcok = (b: Block): Hash => caclulateHash(b.header.version, b.header.index, b.header.previosHash, b.header.timestamp, b.header.merkleRoot)

const isVaildBlockStructure = (b: Block): boolean => b instanceof Block 
const isVaildNewBlock = (newBlock: Block, previosBlock: Block): boolean => {
  if (!isVaildBlockStructure(newBlock)) return false
  if (previosBlock.header.index +1 !== newBlock.header.index) return false
  if (caclulateHashForBlcok(previosBlock) !== newBlock.header.previosHash) return false
  if (getMerkleRoot(newBlock.data) !== newBlock.header.merkleRoot) return false
  return true
}
const isVaildChain = (blockchainToValidate: Blockchain): boolean => {
  if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(getGenesisBlock())) return false
  return _.every(blockchainToValidate, (block, index: number, list) => isVaildNewBlock(block, list[index - 1]))
}
const blockchain:Blockchain = [getGenesisBlock()]

export default class BlockchainService {  
  static getCurrentVersion = (): string => JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8')).version

  static getBlockChain = ():Blockchain => blockchain

  static getLatestBlock = ():Block => blockchain[blockchain.length - 1]
  static generateNextBlock = (blockData) => {
    const previosBlock = BlockchainService.getLatestBlock()
    const currentVersion = BlockchainService.getCurrentVersion()
    const nextIndex = previosBlock.header.index + 1
    const previosHash = caclulateHashForBlcok(previosBlock)
    const nextTimestamp = getCurrentTimestamp()
    const merkleRoot: string = getMerkleRoot(blockData)
    const newBlockHeader = new BlockHeader(currentVersion, nextIndex, previosHash, nextTimestamp, merkleRoot)
    return new Block(newBlockHeader, blockData)
  }
  static addBlock = (newBlock: Block): boolean => {
    if (isVaildNewBlock(newBlock, BlockchainService.getLatestBlock())) {
      blockchain.push(newBlock);
      return true
    }
    return false;
  }
}
