import React from 'react'
import keccak from 'keccak'

export const BlockchainContext = React.createContext()

export class BlockchainProvider extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      blockchain: [],
      currentBlock: {}
    }
    this.getKey = this.getKey.bind(this)
    this.mineBlock = this.mineBlock.bind(this)
    this.createBlock = this.createBlock.bind(this)
    this.generateHash = this.generateHash.bind(this)
    this.getCurrentBlock = this.getCurrentBlock.bind(this)
    this.addToBlockchain = this.addToBlockchain.bind(this)
    this.getPreviousBlock = this.getPreviousBlock.bind(this)
    this.submitTransaction = this.submitTransaction.bind(this)
  }

  componentDidMount() {
    this.createBlock() // Genesis block...
  }

  createBlock(index = 0, prevHash = '00000000', hash = 0, nonce = 0, txs = []) {
    this.setState({
      currentBlock: {
        txs,
        hash,
        nonce,
        index,
        prevHash,
        key: this.getKey(txs, prevHash, index)
      }
    })
  }

  getKey(_txs, _prevHash, _blockIndex, _nonce) {
    return JSON.stringify(_txs) + _prevHash + _blockIndex
  }

  mineBlock() {
    this.addToBlockchain(this.generateHash(this.getCurrentBlock()))
  }

  addToBlockchain({ hash, nonce }) {
    let chain = this.state.blockchain
    let block = this.getCurrentBlock()
    this.createBlock(chain.length + 1, hash)
    block.nonce = nonce
    block.hash = hash
    chain.push(block)
    this.setState({blockchain: chain})
  }


  submitTransaction(_tx) {
    let block = this.getCurrentBlock()
    block.txs.push(_tx)
    this.setState({currentBlock: block})
    console.log('Current Block: ', this.state.currentBlock)
  }

  generateHash(_block) {
    let nonce = _block.nonce
      , hash = keccak('keccak256').update(_block.key + nonce).digest('hex')
    while(!hash.startsWith('00')) {
      nonce += 1
      hash = keccak('keccak256').update(_block.key + nonce).digest('hex')
      console.log('Nonce: ', nonce, ' Hash: ', hash)
    }
    return { hash, nonce }
  }
  


  getCurrentBlock() {
    return this.state.currentBlock
  }

  getPreviousBlock() {
    return this.state.blockchain[this.state.blockchain.length - 1]
  }

  render() {
    return(
      <BlockchainContext.Provider value={{
        mineBlock: this.mineBlock,
        blockchain: this.state.blockchain,
        blockNum: this.state.blockchain.length,
        submitTransaction: this.submitTransaction
      }} >
        {this.props.children}
      </BlockchainContext.Provider>
    )
  }
}