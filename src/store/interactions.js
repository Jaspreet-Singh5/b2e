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

// ---------------------------
// LOAD USER BALANCES (WALLET & EXCHANGE BALANCES)
export const loadBalances = async (tokens, exchange, account, dispatch) => {
    if (!tokens?.length === 2 || !exchange || !account) return;

    let balance = await tokens[0].balanceOf(account);
    balance = ethers.utils.formatEther(balance);
    dispatch({
        type: 'TOKEN1_BALANCE_LOADED',
        balance
    });

    balance = await tokens[1].balanceOf(account);
    balance = ethers.utils.formatEther(balance);
    dispatch({
        type: 'TOKEN2_BALANCE_LOADED',
        balance
    });

    balance = await exchange.balanceOf(tokens[0].address, account);
    balance = ethers.utils.formatEther(balance);
    dispatch({
        type: 'EXCHANGE_TOKEN1_BALANCE_LOADED',
        balance
    });

    balance = await exchange.balanceOf(tokens[1].address, account);
    balance = ethers.utils.formatEther(balance);
    dispatch({
        type: 'EXCHANGE_TOKEN2_BALANCE_LOADED',
        balance
    });
}

// -----------------------------------
// TRANSFER TOKENS (DEPOSIT & WITHDRAWS)

export const transferTokens = async (provider, transferType, token, amount, exchange, dispatch) => {
    let transaction, result;

    dispatch({
        type: 'TRANSFER_REQUEST'
    });

    try {
        const amountToTransfer = ethers.utils.parseEther(amount.toString());
        const signer = provider.getSigner();
    
        // approve tokens
        transaction = await token.connect(signer).approve(exchange.address, amountToTransfer);
        result = transaction.wait();
        
        // deposit tokens
        transaction = await exchange.connect(signer).depositToken(token.address, amountToTransfer);
        result = transaction.wait();
    } catch (err) {
        dispatch({
            type: 'TRANSFER_FAIL'
        });
    }
}

export const subscribeToEvents = (exchange, dispatch) => {
    exchange?.on('Deposit', (token, user, value, balance, event) => {
        dispatch({
            type: 'TRANSFER_SUCCESS',
            event
        })
    })
}
