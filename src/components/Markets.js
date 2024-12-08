import { useSelector, useDispatch } from 'react-redux';
import config from '../config.json';
import { loadTokens } from '../store/interactions';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import { useTokensContracts } from '../hooks/useTokensContracts';

const Markets = () => {
    const { chainId } = useSelector(state => state.provider);
    const provider = useWeb3Connection();
    const dispatch = useDispatch();
    const [ tokens, updateTokens ] = useTokensContracts();

    const marketHandler = async (e) => {
        const addresses = e.target.value.split(',');
        const loadedTokens = await loadTokens(addresses, provider, dispatch);        

        updateTokens(loadedTokens);
    }

    return(
      <div className='component exchange__markets'>
        <div className='component__header'>
            <h2>Select Market</h2>
        </div>
  
            { 
                chainId && config[chainId]
                ? (
                    <select name='markets' id='markets' onChange={marketHandler}>
                    {    
                        Object.entries(config[chainId].tokens || {}).flatMap(([pairToken1, pairToken1Val], i, tokensConfig) => ( 
                            tokensConfig.slice(i + 1).map(([pairToken2, pairToken2Val]) => (
                                <option 
                                    value={`${pairToken1Val.address},${pairToken2Val.address}`} 
                                    key={`${pairToken1Val.address},${pairToken2Val.address}`}>
                                        {pairToken1} / {pairToken2}
                                </option>
                            ))
                        ))
                    }
                    </select>
                )
                : (
                <div>
                    Not deployed to network
                </div>
            )
            }
        <hr />
      </div>
    )
  }
  
  export default Markets;
