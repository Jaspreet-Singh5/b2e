import { ethers } from "ethers";
import TOKEN_ABI from '../abis/Token.json';

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

export const loadTokens = async (addresses, provider, dispatch) => {
    if (addresses?.filter(Boolean).length !== 2 || !provider) return;


    const token1 = new ethers.Contract(addresses[0], TOKEN_ABI, provider);
    const symbol1 = await token1.symbol();

    dispatch({
        type: 'TOKEN1_LOADED',
        symbol: symbol1
    });

    const token2 = new ethers.Contract(addresses[1], TOKEN_ABI, provider);
    const symbol2 = await token2.symbol();

    dispatch({
        type: 'TOKEN2_LOADED',
        symbol: symbol2
    });

    return [token1, token2];
}
