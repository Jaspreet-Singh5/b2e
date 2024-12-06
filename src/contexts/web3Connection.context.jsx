import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const Web3ConnectionContext = createContext({});

export const Web3ConnectionProvicer = ({ children }) => {   
    const [ web3Connection, setWeb3Connection ] = useState(null);

    const loadProvider = () => {
        // connect ethers to blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum);
    
        return provider;
    }

    useEffect(() => {
        setWeb3Connection(loadProvider());
    }, [ window.ethereum ]);

    return <Web3ConnectionContext.Provider value={web3Connection}>{children}</Web3ConnectionContext.Provider>   
}
