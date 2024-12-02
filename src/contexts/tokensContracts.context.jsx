import { ethers } from 'ethers';
import { createContext, useEffect, useState } from 'react'; 
import { useDispatch } from 'react-redux';
import config from '../config.json';
import TOKEN_ABI from '../abis/Token.json';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import { loadNetwork } from '../store/interactions';

export const TokensContractsContext = createContext({
    contract: null
});

export const TokensContractsProvider = ({ children }) => {
    const [ token, setToken ] = useState(null);
    const provider = useWeb3Connection();
    const dispatch = useDispatch();

    const loadToken = (address, abi, provider) => {
        if (!address || !abi || !provider) return;

        const token = new ethers.Contract(address, abi, provider);

        dispatch({
            type: 'TOKEN_LOADED'
        });

        return token
    }
    
    const fetchToken = async () => {
        const chainId = await loadNetwork(provider, dispatch);
        setToken(loadToken(config[chainId]?.BKG.address, TOKEN_ABI, provider));
    }

    useEffect(() => {
        fetchToken();
    }, [provider]);

    return <TokensContractsContext.Provider value={token}>{children}</TokensContractsContext.Provider>
}
