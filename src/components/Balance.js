
import { useSelector, useDispatch } from 'react-redux';
import config from '../config.json';
import { loadBalances, transferTokens } from '../store/interactions';
import { useTokensContracts } from '../hooks/useTokensContracts';
import { useEffect, useState, useRef } from 'react';
import { useExchangeContract } from '../hooks/useExchangeContract';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import { TransferType } from '../enums/transferType';
import { formatValue } from '../utils/formatter';

const Balance = () => {
    const { symbols, balances: tokenBalances } = useSelector(state => state.tokens);
    const { chainId, account } = useSelector(state => state.provider);
    const { balances: exchangeBalances, transferInProgress } = useSelector(state => state.exchange)

    const [ tokens ] = useTokensContracts();
    const exchange = useExchangeContract();
    const provider = useWeb3Connection();

    const dispatch = useDispatch();

    const [ token1TransferAmount, setToken1TransferAmount ] = useState(0);
    const [ token2TransferAmount, setToken2TransferAmount ] = useState(0);
    const [ transferType, setTransferType ] = useState(TransferType.DEPOSIT);

    const depositRef = useRef(null);
    const withdrawRef = useRef(null);
    
    const amountHandler = (e, token) => {
        if (token.address === tokens[0].address) {
          setToken1TransferAmount(+e.target.value);
        } else {
          setToken2TransferAmount(+e.target.value);
        }
    }

    const transferHandler = async (e, token) => {
        e.preventDefault();

        if (token.address === tokens[0].address) {
            await transferTokens(provider, transferType, token, token1TransferAmount, exchange, dispatch);
            setToken1TransferAmount(0);
        } else {
          await transferTokens(provider, transferType, token, token2TransferAmount, exchange, dispatch);
          setToken2TransferAmount(0);
        }
    }

    const tabHandler = (e) => {
      const activeClassName = 'tab--active';
      
      if (e.target === depositRef.current) {
        depositRef.current.className = `tab ${activeClassName}`;
        withdrawRef.current.className = `tab`;

        setTransferType(TransferType.DEPOSIT);
      } else {
        withdrawRef.current.className = `tab ${activeClassName}`;
        depositRef.current.className = `tab`;

        setTransferType(TransferType.WITHDRAW);
      }
    }

    useEffect(() => {
        loadBalances(tokens, exchange, account,  dispatch);
    }, [ tokens, exchange, account, transferInProgress ]);

    return (
      <div className='component exchange__transfers'>
        <div className='component__header flex-between'>
          <h2>Balance</h2>
          <div className='tabs'>
            <button 
              ref={depositRef}
              className='tab tab--active'
              onClick={(e) => tabHandler(e)}
            >Deposit</button>
            <button
              ref={withdrawRef} 
              className='tab'
              onClick={(e) => tabHandler(e)}
            >Withdraw</button>
          </div>
        </div>
  
        {/* Deposit/Withdraw Component 1 */}
  
        <div className='exchange__transfers--form'>
          <div className='flex-between'>
            <p>
                <small>Token</small>
                <br />
                <img src={`/assets/${config[chainId]?.tokens[symbols?.[0]]?.logo}`} alt='Token Logo' />
                {symbols?.[0]}
            </p>

            <p>
                <small>Wallet</small>
                <br />
                { formatValue(tokenBalances?.[0]) }
            </p>

            <p>
                <small>Exchange</small>
                <br />
                { formatValue(exchangeBalances?.[0]) }
            </p>
          </div>
  
          <form onSubmit={(e) => transferHandler(e, tokens[0])}>
            <label htmlFor="token1">{symbols?.[0]} Amount</label>
            <input 
                type="number" 
                id='token1' 
                placeholder='0.0000'
                onChange={(e) => amountHandler(e, tokens[0])}
                value={token1TransferAmount === 0 ? '' : token1TransferAmount}
            />
  
            <button className='button' type='submit'>
              <span>{transferType}</span>
            </button>
          </form>
        </div>
  
        <hr />
  
        {/* Deposit/Withdraw Component 2 */}
  
        <div className='exchange__transfers--form'>
          <div className='flex-between'>
            <p>
              <small>Token</small>
              <br />
              <img src={`/assets/${config[chainId]?.tokens[symbols?.[1]]?.logo}`} alt='Token Logo' />
              {symbols?.[1]}
            </p>

            <p>
                <small>Wallet</small>
                <br />
                { formatValue(tokenBalances?.[1]) }
            </p>

            <p>
                <small>Exchange</small>
                <br />
                { formatValue(exchangeBalances?.[1]) }
            </p>
          </div>
  
          <form onSubmit={(e) => transferHandler(e, tokens[1])}>
            <label htmlFor="token2">{symbols?.[1]} Amount</label>
            <input 
                type="number" 
                id='token2' 
                placeholder='0.0000'
                onChange={(e) => amountHandler(e, tokens[1])}
                value={token2TransferAmount === 0 ? '' : token2TransferAmount}
            />
  
            <button className='button' type='submit'>
              <span>{transferType}</span>
            </button>
          </form>
        </div>
  
        <hr />
      </div>
    );
  }
  
  export default Balance;
