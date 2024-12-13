
import { useSelector, useDispatch } from 'react-redux';
import config from '../config.json';
import { loadBalances, transferTokens } from '../store/interactions';
import { useTokensContracts } from '../hooks/useTokensContracts';
import { useEffect, useState } from 'react';
import { useExchangeContract } from '../hooks/useExchangeContract';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import { ethers } from 'ethers';

const Balance = () => {
    const { symbols, balances: tokenBalances } = useSelector(state => state.tokens);
    const { chainId, account } = useSelector(state => state.provider);
    const { balances: exchangeBalances, transferInProgress } = useSelector(state => state.exchange)

    const [ tokens ] = useTokensContracts();
    const exchange = useExchangeContract();
    const provider = useWeb3Connection();

    const dispatch = useDispatch();

    const [ token1TransferAmount, setToken1TransferAmount ] = useState(0);
    
    const amountHandler = (e, token) => {
        if (token.address === tokens[0].address) {
            setToken1TransferAmount(+e.target.value);
        }
    }

    const depositHandler = async (e, token) => {
        e.preventDefault();

        if (token.address === tokens[0].address) {
            await transferTokens(provider, 'DEPOSIT', token, token1TransferAmount, exchange, dispatch);
            setToken1TransferAmount(0);
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
            <button className='tab tab--active'>Deposit</button>
            <button className='tab'>Withdraw</button>
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
                { Number(tokenBalances?.[0] || '0').toFixed(2) }
            </p>

            <p>
                <small>Exchange</small>
                <br />
                { Number(exchangeBalances?.[0] || '0').toFixed(2) }
            </p>
          </div>
  
          <form onSubmit={(e) => depositHandler(e, tokens[0])}>
            <label htmlFor="token1">{symbols?.[0]} Amount</label>
            <input 
                type="number" 
                id='token1' 
                placeholder='0.0000'
                onChange={(e) => amountHandler(e, tokens[0])}
                value={token1TransferAmount === 0 ? '' : token1TransferAmount}
            />
  
            <button className='button' type='submit'>
              <span>Deposit</span>
            </button>
          </form>
        </div>
  
        <hr />
  
        {/* Deposit/Withdraw Component 2 */}
  
        <div className='exchange__transfers--form'>
          <div className='flex-between'>
  
          </div>
  
          <form>
            <label htmlFor="token2"></label>
            <input type="text" id='token2' placeholder='0.0000'/>
  
            <button className='button' type='submit'>
              <span></span>
            </button>
          </form>
        </div>
  
        <hr />
      </div>
    );
  }
  
  export default Balance;
