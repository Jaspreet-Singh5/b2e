import { createContext, useEffect, useState } from 'react'; 
import { useDispatch } from 'react-redux';
import config from '../config.json';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import { loadNetwork, loadTokens } from '../store/interactions';

export const TokensContractsContext = createContext({
    contract: null
});

export const TokensContractsProvider = ({ children }) => {
    const [ tokens, setTokens ] = useState([]);
    const provider = useWeb3Connection();
    const dispatch = useDispatch();
    
    /**
     * A consistent way to update tokens
     * @param {*} loadedTokens 
     */
    const updateTokens = (loadedTokens) => {
        if (loadedTokens?.length !== 2) return;
        
        setTokens(loadedTokens);
    }

    const fetchTokens = async () => {
        const chainId = await loadNetwork(provider, dispatch);
        const { BKG, mETH } = config[chainId]?.tokens || {};
        const addresses = [
            BKG?.address,
            mETH?.address
        ];
        const loadedTokens = await loadTokens(addresses, provider, dispatch) ?? [];

        updateTokens(loadedTokens);
    }

    useEffect(() => {
        fetchTokens();
    }, [ provider ]);

    return <TokensContractsContext.Provider value={{tokens, updateTokens}}>{children}</TokensContractsContext.Provider>
}
