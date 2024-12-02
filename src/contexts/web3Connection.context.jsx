import { createContext, useRef } from 'react';
import { ethers } from 'ethers';

export const Web3ConnectionContext = createContext({});

export const Web3ConnectionProvicer = ({ children }) => {   
    const web3ConnectionRef = useRef(null);

    const loadProvider = () => {
        // connect ethers to blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum);
    
        return provider;
    }

    if (!web3ConnectionRef.current) {
        setTimeout(() => {

            web3ConnectionRef.current = loadProvider();
        }, 2000);
    }

    return <Web3ConnectionContext.Provider value={web3ConnectionRef}>{children}</Web3ConnectionContext.Provider>   
}
