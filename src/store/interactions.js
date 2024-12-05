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

export const loadAccount = async (dispatch, provider) => {
    if (!provider) return;

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0]);

    dispatch({
        type: 'ACCOUNT_LOADED',
        account
    });

    let balance = await provider.getBalance(account);
    balance = ethers.utils.formatEther(balance);

    dispatch({
        type: 'ETHER_BALANCE_LOADED',
        balance
    })

    return account;
}

export const loadSymbol = async (token, dispatch) => {
    if (!token) return;
    
    const symbol = await token.symbol();

    dispatch({
        type: 'SYMBOL_LOADED',
        symbol
    });

    return symbol;
}
