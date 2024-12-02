
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAccount, loadSymbol } from '../store/interactions';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import { useTokensContracts } from '../hooks/useTokensContracts';

function App() {
  const dispatch = useDispatch();
  // connect ethers to blockchain
  const provider = useWeb3Connection();
  const token = useTokensContracts();

  const loadBlockchainData = async () => {
    try {
      const account = await loadAccount(dispatch);    
      const symbol = await loadSymbol(token, dispatch);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadBlockchainData();
  }, [provider, token]);
 
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
