import { useContext } from 'react';
import { TokensContractsContext } from '../contexts/tokensContracts.context';

export const useTokensContracts = () => {
    const tokens = useContext(TokensContractsContext);

    return tokens;
}
