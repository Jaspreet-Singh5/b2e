import { useSelector, useDispatch } from 'react-redux';
import sort from '../assets/sort.svg';
import { orderBookSelector } from '../store/selectors';
import { useTokensContracts } from '../hooks/useTokensContracts';
import { OrderType } from '../enums/orderType';
import { fillOrder } from '../store/interactions';
import { useExchangeContract } from '../hooks/useExchangeContract';
import { useWeb3Connection } from '../hooks/useWeb3Connection';

const OrderBook = () => {
    const [ tokens ] = useTokensContracts();
    const exchange = useExchangeContract();
    const provider = useWeb3Connection();
    
    const { symbols } = useSelector(state => state.tokens);
    const orderBook = useSelector(state => orderBookSelector(state, tokens));

    const dispatch = useDispatch();

    const fillOrderHandler = async (e, orderId) => {
        e.preventDefault();

        await fillOrder(orderId, exchange, provider, dispatch);
    }

    return (
        <div className="component exchange__orderbook">
            <div className='component__header flex-between'>
                <h2>Order Book</h2>
            </div>

            <div className="flex">
                {
                    orderBook?.[OrderType.SELL]
                    ? (
                        <table className='exchange__orderbook--sell'>
                            <caption>Selling</caption>
                            <thead>
                                <tr>
                                    <th>{symbols?.[0]}<img src={sort} alt='Sort' /></th>
                                    <th>{symbols?.[0]}/{symbols?.[1]}<img src={sort} alt='Sort' /></th>
                                    <th>{symbols?.[1]}<img src={sort} alt='Sort' /></th>
                                </tr>
                            </thead>
                            <tbody>

                                {/* MAPPING OF SELLING ORDERS */}
                                {
                                    orderBook[OrderType.SELL].map(order => {
                                        return (
                                            <tr key={btoa(order.id)}
                                                onClick={(e) => fillOrderHandler(e, order.id)}>
                                                <td>{order.token0Amount}</td>
                                                <td style={{color: order.orderTypeClass}}>{order.tokenPrice}</td>
                                                <td>{order.token1Amount}</td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    )
                    : (
                        <p className='flex-center'>No Sell Orders</p>
                    )
                }


                <div className='divider'></div>

                {
                    orderBook?.[OrderType.BUY]
                    ? (
                        <table className='exchange__orderbook--buy'>
                            <caption>Buying</caption>
                            <thead>
                                <tr>
                                    <th>{symbols?.[0]}<img src={sort} alt='Sort' /></th>
                                    <th>{symbols?.[0]}/{symbols?.[1]}<img src={sort} alt='Sort' /></th>
                                    <th>{symbols?.[1]}<img src={sort} alt='Sort' /></th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    orderBook[OrderType.BUY].map(order => {
                                        return (
                                            <tr key={btoa(order.id)}
                                                onClick={(e) => fillOrderHandler(e, order.id)}
                                            >
                                                <td>{order.token0Amount}</td>
                                                <td style={{color: order.orderTypeClass}}>{order.tokenPrice}</td>
                                                <td>{order.token1Amount}</td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    )
                    : (
                        <p className='flex-center'>No Buy Orders</p>
                    )
                }
            </div>
        </div>
    );
}

export default OrderBook;
