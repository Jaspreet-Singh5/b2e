import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const Web3ConnectionContext = createContext({});

export const Web3ConnectionProvicer = ({ children }) => {   
    const [ web3Connection, setWeb3Connection ] = useState();

    const loadProvider = async () => {
        try {
            // login user
            // await window.ethereum.request({
            //     method: "eth_requestAccounts",
            // });
    
            // connect ethers to blockchain
            const provider = new ethers.providers.Web3Provider(window.ethereum);
        
            return provider;
        } catch(error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const setConn = async () => {
            const provider = await loadProvider();
            setWeb3Connection(provider);
        }

        setConn();
        
    }, []);
    return <Web3ConnectionContext.Provider value={web3Connection}>{children}</Web3ConnectionContext.Provider>   
}
