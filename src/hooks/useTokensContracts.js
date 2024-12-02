import { useContext } from 'react';
import { TokensContractsContext } from '../contexts/tokensContracts.context';

export const useTokensContracts = () => {
    const tokenRef = useContext(TokensContractsContext);

    if (!tokenRef) {
        throw new Error('useTokensContracts must be used within a TokensContractsProvider');
    }

    return tokenRef.current;
}
