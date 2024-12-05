import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAccount, loadSymbol } from '../store/interactions';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import { useTokensContracts } from '../hooks/useTokensContracts';
import Navbar from './Navbar';

function App() {
	const dispatch = useDispatch();
	const tokens = useTokensContracts();
	// connect to blockchain
	const provider = useWeb3Connection();

	const loadBlockchainData = async () => {
		try {
			// fetch current account and balance when changed
			window.ethereum.on('accountsChanged', async () => {
				await loadAccount(dispatch, provider);    
			});

			tokens?.map(async (token) => {
				await loadSymbol(token, dispatch);
			});
		} catch (err) {
			console.log(err);
		}
  	}

	useEffect(() => {
		loadBlockchainData();
  	}, [ tokens, provider ]);
 
  	return (
		<div>

			{/* Navbar */}
			<Navbar />

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
