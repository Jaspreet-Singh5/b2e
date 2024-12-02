import { ethers } from 'ethers';
import { createContext, useRef, useEffect } from 'react'; 
import { useDispatch } from 'react-redux';
import config from '../config.json';
import TOKEN_ABI from '../abis/Token.json';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import { loadNetwork } from '../store/interactions';

export const TokensContractsContext = createContext({
    contract: null
});

export const TokensContractsProvider = ({ children }) => {
    const tokenRef = useRef(null);
    const provider = useWeb3Connection();
    const dispatch = useDispatch();

    const loadToken = async (address, abi, provider) => {
        const token = new ethers.Contract(address, abi, provider);

        dispatch({
            type: 'TOKEN_LOADED'
        });

        return token
    }
    
    const fetchToken = async () => {
        if (!tokenRef.current && provider) {
            const chainId = await loadNetwork(provider, dispatch);
            tokenRef.current = await loadToken(config[chainId].BKG.address, TOKEN_ABI, provider);
        }
    }

    useEffect(() => {
        fetchToken();
    }, [provider]);

    return <TokensContractsContext.Provider value={tokenRef}>{children}</TokensContractsContext.Provider>
}
