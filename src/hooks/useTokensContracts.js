import { useContext } from 'react';
import { TokensContractsContext } from '../contexts/tokensContracts.context';

export const useTokensContracts = () => {
    const { tokens, updateTokens } = useContext(TokensContractsContext);

    return [tokens, updateTokens];
}
