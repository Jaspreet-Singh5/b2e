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
    const [ tokens, setTokens ] = useState([]);
    const provider = useWeb3Connection();
    const dispatch = useDispatch();

    const loadTokens = (addresses, abi, provider) => {
        if (!addresses?.length > 0 || !abi || !provider) return;

        const tokens = addresses.map((address) => {
            const token = new ethers.Contract(address, abi, provider);
            return token;
        });

        dispatch({
            type: 'TOKENS_LOADED'
        });

        return tokens;
    }
    
    const fetchTokens = async () => {
        const chainId = await loadNetwork(provider, dispatch);
        const addresses = [ 
            config[chainId]?.BKG?.address,
            config[chainId]?.mETH?.address,
            config[chainId]?.mSOL?.address,
            config[chainId]?.mUSDT?.address,
        ];
        const loadedTokens = loadTokens(addresses, TOKEN_ABI, provider) ?? [];

        setTokens(prevTokens => [
            ...prevTokens,
            ...loadedTokens
        ]);
    }

    useEffect(() => {
        fetchTokens();
    }, [ provider ]);

    return <TokensContractsContext.Provider value={tokens}>{children}</TokensContractsContext.Provider>
}
