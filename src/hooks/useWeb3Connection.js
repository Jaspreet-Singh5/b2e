import { useContext } from 'react';
import { Web3ConnectionContext } from '../contexts/web3Connection.context';

export const useWeb3Connection = () => {
    const connection = useContext(Web3ConnectionContext);
    
    return connection;
}
