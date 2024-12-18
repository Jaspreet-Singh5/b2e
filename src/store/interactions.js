import { ethers } from "ethers";
import TOKEN_ABI from '../abis/Token.json';
import { TransferType } from "../enums/transferType";
import { OrderType } from "../enums/orderType";
import { parseTokens } from "../utils/parser";
import { formatOrder } from "../utils/formatter";

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
        const amountToTransfer = parseTokens(amount.toString());
        const signer = await provider.getSigner();
    
        
        if (transferType === TransferType.DEPOSIT) {
            // approve tokens
            transaction = await token.connect(signer).approve(exchange.address, amountToTransfer);
            result = transaction.wait();

            // deposit tokens
            transaction = await exchange.connect(signer).depositToken(token.address, amountToTransfer);
            result = transaction.wait();
        } else {
            // withdraw tokens
            transaction = await exchange.connect(signer).withdrawToken(token.address, amountToTransfer);
            result = transaction.wait();
        }
        
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
    });

    exchange?.on('Withdraw', (token, user, value, balance, event) => {
        dispatch({
            type: 'TRANSFER_SUCCESS',
            event
        })
    });

    exchange?.on('Order', (
        id,
        user,
        tokenGet,
        valueGet,
        tokenGive,
        valueGive,
        timestamp,
        event
    ) => {
        const order = formatOrder(event.args);

        dispatch({
            type: 'NEW_ORDER_SUCCESS',
            order,
            event
        })
    });
}

export const orderTokens = async (provider, exchange, orderType, tokens, amount, price, dispatch) => {
    const signer = await provider.getSigner();
    let transaction, result;

    dispatch({
        type: 'NEW_ORDER_REQUEST'
    })

    try {
        if (orderType === OrderType.BUY) {
            transaction = await exchange
                .connect(signer)
                .makeOrder(
                    tokens[0].address,
                    parseTokens(amount),
                    tokens[1].address,
                    parseTokens(amount * price)
                );
            result = transaction.wait();
        } else {
            transaction = await exchange
                .connect(signer)
                .makeOrder(
                    tokens[1].address,
                    parseTokens(amount * price),
                    tokens[0].address,
                    parseTokens(amount)
                );
            result = transaction.wait();
        }
    } catch (err) {
        console.error(err);

        dispatch({
            type: 'NEW_ORDER_FAIL'
        })
    }
}

export const loadAllOrders = async (exchange, provider, dispatch) => {
    if (!exchange) return;

    const orderLogs = await exchange.queryFilter('Order');
    const allOrders = orderLogs.map(orderLog => formatOrder(orderLog.args));
    
    dispatch({
        type: 'ALL_ORDERS_LOADED',
        allOrders
    })
}
