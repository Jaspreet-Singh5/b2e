import { useContext } from 'react';
import { ExchangeContractContext } from '../contexts/exchangeContract.context';


export const useExchangeContract = () => {
    const exchange = useContext(ExchangeContractContext);

    return exchange;
}
