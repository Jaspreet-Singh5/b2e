import { useSelector } from 'react-redux';
import { useTokensContracts } from '../hooks/useTokensContracts';
import { myOpenOrdersSelector } from '../store/selectors';
import sort from '../assets/sort.svg';
import Banner from './Banner';

const Transactions = () => {
    const [ tokens ] = useTokensContracts();

    const myOpenOrders = useSelector(state => myOpenOrdersSelector(state, tokens));
    const { symbols } = useSelector(state => state.tokens);

    return (
        <div className="component exchange__transactions">
            <div>
                <div className='component__header flex-between'>
                    <h2>My Orders</h2>

                    <div className='tabs'>
                        <button className='tab tab--active'>Orders</button>
                        <button className='tab'>Trades</button>
                    </div>
                </div>

                {
                    myOpenOrders?.length > 0
                    ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>{symbols?.[0]}<img src={sort} alt='Sort'/></th>
                                    <th>{symbols?.[0]}/{symbols?.[1]}<img src={sort} alt='Sort' /></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    myOpenOrders?.map(order => (
                                        <tr key={order.id}>
                                            <td>{order.token0Amount}</td>
                                            <td style={{ color: order.orderTypeClass }}>{order.tokenPrice}</td>
                                            <td></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    ) : (
                        <Banner>No Open Orders</Banner>
                    )
                }

            </div>

            {/* <div> */}
            {/* <div className='component__header flex-between'> */}
            {/* <h2>My Transactions</h2> */}

            {/* <div className='tabs'> */}
            {/* <button className='tab tab--active'>Orders</button> */}
            {/* <button className='tab'>Trades</button> */}
            {/* </div> */}
            {/* </div> */}

            {/* <table> */}
            {/* <thead> */}
            {/* <tr> */}
            {/* <th></th> */}
            {/* <th></th> */}
            {/* <th></th> */}
            {/* </tr> */}
            {/* </thead> */}
            {/* <tbody> */}

            {/* <tr> */}
            {/* <td></td> */}
            {/* <td></td> */}
            {/* <td></td> */}
            {/* </tr> */}

            {/* </tbody> */}
            {/* </table> */}

            {/* </div> */}
        </div>
    )
}

export default Transactions;
