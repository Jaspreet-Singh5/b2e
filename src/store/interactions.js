import { ethers } from "ethers";

export const loadNetwork = async (provider, dispatch) => {
    if (!provider) return;
    
    const { chainId } = await provider.getNetwork();

    dispatch({
        type: 'NETWORK_LOADED',
        chainId
    });

    return chainId;
}

export const loadAccount = async (dispatch) => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0]);

    dispatch({
        type: 'ACCOUNT_LOADED',
        account
    });

    return account;
}

export const loadSymbol = async (token, dispatch) => {
    const symbol = await token.symbol();

    dispatch({
        type: 'SYMBOL_LOADED',
        symbol
    });

    return symbol;
}
