import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAccount, loadAllOrders, subscribeToEvents } from '../store/interactions';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import Navbar from './Navbar';
import Markets from './Markets';
import Balance from './Balance';
import { useExchangeContract } from '../hooks/useExchangeContract';
import Order from './Order';
import OrderBook from './OrderBook';
import PriceChart from './PriceChart';
import Trades from './Trades';

function App() {
	const dispatch = useDispatch();
	// connect to blockchain
	const provider = useWeb3Connection();
	const exchange = useExchangeContract();

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

		// Fetch all orders: open, filled, cancelled
		loadAllOrders(exchange, provider, dispatch);

		subscribeToEvents(exchange, dispatch);
  	}, [ provider, exchange ]);
 
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
				<Order />	

				</section>
				<section className='exchange__section--right grid'>

				{/* PriceChart */}
				<PriceChart />

				{/* Transactions */}

				{/* Trades */}
				<Trades />

				{/* OrderBook */}
				<OrderBook />

				</section>
			</main>

			{/* Alert */}

		</div>
	);
}

export default App;
