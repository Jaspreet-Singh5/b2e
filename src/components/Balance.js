
import { useSelector } from 'react-redux';
import config from '../config.json';

const Balance = () => {
    const { symbols } = useSelector(state => state.tokens);
    const { chainId } = useSelector(state => state.provider);

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
                <img src={`/assets/${config[chainId]?.tokens[symbols[0]]?.logo}`} alt='Token Logo' />
            </p>
          </div>
  
          <form>
            <label htmlFor="token1"></label>
            <input type="text" id='token1' placeholder='0.0000' />
  
            <button className='button' type='submit'>
              <span></span>
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
