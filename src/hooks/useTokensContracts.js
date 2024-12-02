import { useContext } from 'react';
import { TokensContractsContext } from '../contexts/tokensContracts.context';

export const useTokensContracts = () => {
    const token = useContext(TokensContractsContext);

    return token;
}
