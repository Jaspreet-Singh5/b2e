import { useContext } from 'react';
import { Web3ConnectionContext } from '../contexts/web3Connection.context';

export const useWeb3Connection = () => {
    const connectionRef = useContext(Web3ConnectionContext);

    if (!connectionRef) {
        throw new Error('useWeb3Connection must be used within a Web3ConnectionProvider');
    }
    
    return connectionRef.current;
}
