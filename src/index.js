import React from 'react'
import ReactDOM from 'react-dom'
import { BlockchainContext, BlockchainProvider } from './context/blockchain'

const App = () => (
  <BlockchainProvider>
    <BlockchainContext.Consumer>
      {({ blockchain, blockNum, submitTransaction, mineBlock }) => {
        let x = () => console.log('The blockchain: ', blockchain)
        return (
          <React.Fragment>
            <p>Block number: {blockNum}</p>
            <button onClick={() => submitTransaction(['Winslow', 'Homer'])}>Add TX</button><br/><br/>
            <button onClick={() => mineBlock()}>Mine Block</button><br/><br/>
            <button onClick={x}>Console Log BC</button>
          </React.Fragment>
        )
      }}
    </BlockchainContext.Consumer>
  </BlockchainProvider>
)

ReactDOM.render(<App />, document.getElementById('root'));
