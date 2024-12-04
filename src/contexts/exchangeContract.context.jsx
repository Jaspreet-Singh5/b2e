import { ethers } from 'ethers';
import { createContext, useEffect, useState } from 'react'; 
import { useDispatch } from 'react-redux';
import config from '../config.json';
import Exchange_ABI from '../abis/Exchange.json';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import { loadNetwork } from '../store/interactions';

export const ExchangeContractContext = createContext({
    contract: null
});

export const ExchangeContractProvider = ({ children }) => {
    const [ exchange, setExchange ] = useState([]);
    const provider = useWeb3Connection();
    const dispatch = useDispatch();

    const loadExchange = (address, abi, provider) => {
        if (!address || !abi || !provider) return;

        const exchange = new ethers.Contract(address, abi, provider);        

        dispatch({
            type: 'EXCHANGE_LOADED'
        });

        return exchange;
    }
    
    const fetchExchange = async () => {
        const chainId = await loadNetwork(provider, dispatch);
        const address = config[chainId]?.exchange?.address;
        const loadedExchange = loadExchange(address, Exchange_ABI, provider) ?? [];

        setExchange(loadedExchange);
    }

    useEffect(() => {
        fetchExchange();
    }, [ provider ]);

    return <ExchangeContractContext.Provider value={exchange}>{children}</ExchangeContractContext.Provider>
}
