import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAccount, subscribeToEvents } from '../store/interactions';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import Navbar from './Navbar';
import Markets from './Markets';
import Balance from './Balance';
import { useExchangeContract } from '../hooks/useExchangeContract';
import Order from './Order';
import OrderBook from './OrderBook';
import PriceChart from './PriceChart';
import Trades from './Trades';
import Transactions from './Transactions';
import Alert from './Alert';
import { formatOrder } from '../utils/formatter';
import { gql, useQuery } from '@apollo/client';

const LOADALLORDERS = gql`
    query {
        cancels {
            id
            user
            tokenGet
            timestamp
            tokenGive
            valueGet
            valueGive
        }

		trades {
			id
			creator
			timestamp
			tokenGet
			tokenGive
			user
			valueGet
			valueGive
		}

		orders {
			id
			timestamp
			tokenGet
			tokenGive
			user
			valueGet
			valueGive
		}
    }
`;

function App() {
	const dispatch = useDispatch();
	// connect to blockchain
	const provider = useWeb3Connection();
	const exchange = useExchangeContract();
	
	const { loading, error, data } = useQuery(LOADALLORDERS);
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

	const loadAllOrders = (cancelledOrdersLogs, filledOrdersLogs, allOrderLogs) => {
		const cancelledOrders = cancelledOrdersLogs.map(cancelledOrdersLog => formatOrder(cancelledOrdersLog));
	
		dispatch({
			type: 'CANCELLED_ORDERS_LOADED',
			cancelledOrders
		});
	
		const filledOrders = filledOrdersLogs.map(filledOrdersLog => formatOrder(filledOrdersLog));
	
		dispatch({
			type: 'FILLED_ORDERS_LOADED',
			filledOrders
		});
	
		const allOrders = allOrderLogs.map(orderLog => formatOrder(orderLog));
		
		dispatch({
			type: 'ALL_ORDERS_LOADED',
			allOrders
		})
	}
	
	useEffect(() => {
		window.ethereum.on('chainChanged', () => {
			window.location.reload();
		});
		
		loadBlockchainData();

		if (data) {
			const {
				cancels,
				orders,
				trades
			} = data;
			// Fetch all orders: open, filled, cancelled
			loadAllOrders(cancels, trades, orders);
		}

		subscribeToEvents(exchange, dispatch);
  	}, [ provider, exchange, data ]);
 
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
				<Transactions />

				{/* Trades */}
				<Trades />

				{/* OrderBook */}
				<OrderBook />

				</section>
			</main>

			{/* Alert */}
			<Alert />

		</div>
	);
}

export default App;
