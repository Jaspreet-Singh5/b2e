import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAccount, loadSymbol } from '../store/interactions';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import Navbar from './Navbar';
import Markets from './Markets';
import Balance from './Balance';

function App() {
	const dispatch = useDispatch();
	// connect to blockchain
	const provider = useWeb3Connection();

	const loadBlockchainData = async () => {
		try {
			// fetch current account and balance when changed
			window.ethereum.on('accountsChanged', async () => {
				await loadAccount(dispatch, provider);    
			});
		} catch (err) {
			console.log(err);
		}
  	}

	useEffect(() => {
		window.ethereum.on('chainChanged', () => {
			window.location.reload();
		});

		loadBlockchainData();
  	}, [ provider ]);
 
  	return (
		<div>

			{/* Navbar */}
			<Navbar />

			<main className='exchange grid'>
				<section className='exchange__section--left grid'>

				{/* Markets */}
				<Markets />

				{/* Balance */}
				<Balance />

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
