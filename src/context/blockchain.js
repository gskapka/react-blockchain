import React from 'react'
import keccak from 'keccak'

export const BlockchainContext = React.createContext()

// TODO: Set flag when mining, if new tx added during, it gets added to new block

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
  /**
   * Create block prototype
   */
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
  /**
   * Returns key string to be hashed with the nonce
   */
  getKey(_txs, _prevHash, _blockIndex) {
    return JSON.stringify(_txs) + _prevHash + _blockIndex
  }
  /**
   * Performs proof of work on the current block's txs before adding
   * it to bc.
   */
  mineBlock() {
    this.addToBlockchain(this.generateHash(this.getCurrentBlock()))
  }
  /**
   * Adds results of PoW algo to current block, appends it to bc 
   * and generates the next empty block with correct deets as 
   * the new "current block"
   */
  addToBlockchain({ hash, nonce }) {
    let chain = this.state.blockchain
    let block = this.getCurrentBlock()
    block.nonce = nonce
    block.hash = hash
    chain.push(block)
    this.createBlock(chain.length + 1, hash)
    this.setState({blockchain: chain})
  }
  /**
   * Chucks a "tx" in the tx array in the current block
   */
  submitTransaction(_tx) {
    let block = this.getCurrentBlock()
    block.txs.push(_tx)
    this.setState({currentBlock: block})
    console.log('Current Block: ', this.state.currentBlock)
  }
  /**
   * Keccack hashes current blocks txs with the block key until 
   * hash prefixed with correct number of 0's is discovered, per
   * Nakomoto's original algo. Returns that hash plus the nonce 
   * that generated it.
   */
  generateHash(_block) {
    let nonce = _block.nonce
      , hash  = keccak('keccak256').update(_block.key + nonce).digest('hex')
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