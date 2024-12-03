
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAccount, loadSymbol } from '../store/interactions';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import { useTokensContracts } from '../hooks/useTokensContracts';

function App() {
  const dispatch = useDispatch();
  const tokens = useTokensContracts();

  const loadBlockchainData = async () => {
    try {
      await loadAccount(dispatch);    

      tokens?.map(async (token) => {
        await loadSymbol(token, dispatch);
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadBlockchainData();
  }, [ tokens ]);
 
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
