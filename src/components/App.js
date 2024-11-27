
import { useEffect } from 'react';
import '../App.css';
import { ethers } from 'ethers';
import config from '../config.json';
import TOKEN_ABI from '../abis/Token.json';

function App() {

  const loadBlockchainData = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // connect ethers to blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const { chainId } = await provider.getNetwork();

      // Token smart contract
      const token = new ethers.Contract(config[chainId].BKG.address, TOKEN_ABI, provider);
      const symbol = await token.symbol();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadBlockchainData();
  });
 
  return (
    <div>

      {/* Navbar */}

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;
