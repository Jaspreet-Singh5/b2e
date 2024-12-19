import { useSelector } from 'react-redux';
import sort from '../assets/sort.svg';
import { orderBookSelector } from '../store/selectors';
import { useTokensContracts } from '../hooks/useTokensContracts';

const OrderBook = () => {
    const [ tokens ] = useTokensContracts();
    
    const { symbols } = useSelector(state => state.tokens);
    const orderBook = useSelector(state => orderBookSelector(state, tokens));

    return (
        <div className="component exchange__orderbook">
            <div className='component__header flex-between'>
                <h2>Order Book</h2>
            </div>

            <div className="flex">

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
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <div className='divider'></div>

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
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderBook;
