import { useSelector } from 'react-redux';
import { filledOrdersSelector } from '../store/selectors';
import { useTokensContracts } from '../hooks/useTokensContracts';
import sort from '../assets/sort.svg';
import Banner from './Banner';

const Trades = () => {
    const [ tokens ] = useTokensContracts();

    const filledOrders = useSelector(state => filledOrdersSelector(state, tokens));
    const { symbols } = useSelector(state => state.tokens);

    return (
        <div className="component exchange__trades">
            <div className='component__header flex-between'>
                <h2>Trades</h2>
            </div>

            {
                filledOrders?.length > 0
                ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Time<img src={sort} alt='sort' /></th>
                                <th>{symbols?.[0]}<img src={sort} alt='sort' /></th>
                                <th>{symbols?.[0]}/{symbols?.[1]}<img src={sort} alt='sort' /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filledOrders.map(order => (        
                                    <tr key={btoa(order.id)}>
                                        <td>{order.formattedTimestamp}</td>
                                        <td>{order.token0Amount}</td>
                                        <td style={{color: order.tokenPriceClass}}>{order.tokenPrice}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                ) : (
                    <Banner>No Transactions</Banner>
                )
            }

        </div>
    );
}

export default Trades;
