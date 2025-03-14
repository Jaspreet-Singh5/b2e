import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { OrderType } from '../enums/orderType';
import { formatValue } from '../utils/formatter';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import { useExchangeContract } from '../hooks/useExchangeContract';
import { useTokensContracts } from '../hooks/useTokensContracts';
import { orderTokens } from '../store/interactions';

const Order = () => {
    const [ amount, setAmount ] = useState(0);
    const [ price, setPrice ] = useState(0);
    const [ orderType, setOrderType ] = useState(OrderType.BUY);

    const buyRef = useRef();
    const sellRef = useRef();

    const { symbols } = useSelector(state => state.tokens);
    
    const provider = useWeb3Connection();
    const exchange = useExchangeContract();
    const [ tokens ] = useTokensContracts();

    const dispatch = useDispatch();

    const tabHandler = (e) => {
        if (e.target == buyRef.current) {
            buyRef.current.className = 'tab tab--active';
            sellRef.current.className = 'tab';

            setOrderType(OrderType.BUY);
        } else {
            sellRef.current.className = 'tab tab--active';
            buyRef.current.className = 'tab';

            setOrderType(OrderType.SELL);
        }
    }

    const orderHandler = async (e) => {
        e.preventDefault();

        await orderTokens(provider, exchange, orderType, tokens, amount, price, dispatch);

        setAmount(0);
        setPrice(0);
    }

    return (
      <div className="component exchange__orders">
        <div className='component__header flex-between'>
          <h2>New Order</h2>
          <div className='tabs'>
            <button 
                className='tab tab--active' 
                onClick={e => tabHandler(e)}
                ref={buyRef}
            >
                Buy
            </button>
            <button 
                className='tab' 
                onClick={e => tabHandler(e)}
                ref={sellRef}
            >
                Sell
            </button>
          </div>
        </div>
  
        <form onSubmit={e => orderHandler(e)}>
            <label htmlFor='amount'>
                {orderType} Amount ({symbols[0]})
            </label>

            <input 
                type="number" 
                id='amount' 
                placeholder='0.0000' 
                onChange={e => setAmount(e.target.value)}
                value={amount === 0 ? '' : amount}
                min="0"
            />
  
            <label htmlFor='price'>
                {orderType} Price ({symbols[1]})
            </label>
            <input 
                type="number" 
                id='price' 
                placeholder='0.0000' 
                onChange={e => setPrice(e.target.value)}
                value={price === 0 ? '' : price }
                min="0"
            />

            <hr />

            <div className='flex justify-between'>
                <span>{orderType} for</span>
                <span>
                    { formatValue(amount * price) } {symbols[1]}
                </span>
            </div>
            <button className='button button--filled' type='submit'>
                {orderType} Order
            </button>
        </form>
      </div>
    );
}
  
export default Order;
