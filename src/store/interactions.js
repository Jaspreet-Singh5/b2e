import { ethers } from "ethers";
import TOKEN_ABI from '../abis/Token.json';
import { TransferType } from "../enums/transferType";
import { OrderType } from "../enums/orderType";
import { parseTokens } from "../utils/parser";
import { formatOrder } from "../utils/formatter";
import axios from "axios";

export const loadNetwork = async (provider, dispatch) => {
    if (!provider) return;

    try {
        const { chainId } = await provider.getNetwork();
    
        dispatch({
            type: 'NETWORK_LOADED',
            chainId
        });
    
        return chainId;
    } catch (err) {
        console.error(err);
    }
}

export const loadAccount = async (dispatch, provider) => {
    if (!provider) return;

    try {
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
    } catch (err) {
        console.error(err);
    }
}

export const loadTokens = async (addresses, provider, dispatch) => {
    if (addresses?.filter(Boolean).length !== 2 || !provider) return;

    try {
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
    } catch (err) {
        console.error(err);
    }
}

// ---------------------------
// LOAD USER BALANCES (WALLET & EXCHANGE BALANCES)
export const loadBalances = async (tokens, exchange, account, dispatch) => {
    if (tokens?.length !== 2 || !exchange || !account) return;

    try {
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
    } catch (err) {
        console.error(err);
    }
}

// -----------------------------------
// TRANSFER TOKENS (DEPOSIT & WITHDRAWS)

export const transferTokens = async (provider, transferType, token, amount, exchange, dispatch, chainId) => {
    let transaction;

    dispatch({
        type: 'TRANSFER_REQUEST'
    });

    try {
        const amountToTransfer = parseTokens(amount.toString());
        const signer = await provider.getSigner();
    
        
        if (transferType === TransferType.DEPOSIT) {
            // get max fees from gas station
            let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
            let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
            
            try {
                const { data } = await axios({
                    method: 'get',
                    url: `https://gas.api.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}/networks/${chainId}/suggestedGasFees`
                })

                maxFeePerGas = ethers.utils.parseUnits(
                    Math.ceil(data?.['high']?.suggestedMaxFeePerGas) + '',
                    'gwei'
                )
                maxPriorityFeePerGas = ethers.utils.parseUnits(
                    Math.ceil(data?.['high']?.suggestedMaxPriorityFeePerGas) + '',
                    'gwei'
                )
            } catch (err) {
                console.error(err);
            }

            // approve tokens
            transaction = await token.connect(signer).approve(exchange.address, amountToTransfer, {
                maxFeePerGas,
                maxPriorityFeePerGas,
            });
            await transaction.wait();
       
            // deposit tokens
            transaction = await exchange.connect(signer).depositToken(token.address, amountToTransfer, {
                maxFeePerGas,
                maxPriorityFeePerGas,
                gasLimit: 250000
            });
            await transaction.wait();
        } else {
            // withdraw tokens
            transaction = await exchange.connect(signer).withdrawToken(token.address, amountToTransfer);
            await transaction.wait();
        }
        
    } catch (err) {
        console.error(err);
        dispatch({
            type: 'TRANSFER_FAIL'
        });
    }
}

export const subscribeToEvents = (exchange, dispatch) => {
    exchange?.on('Deposit', (_token, _user, _value, _balance, event) => {
        dispatch({
            type: 'TRANSFER_SUCCESS',
            event
        })
    });

    exchange?.on('Withdraw', (_token, _user, _value, _balance, event) => {
        dispatch({
            type: 'TRANSFER_SUCCESS',
            event
        })
    });

    exchange?.on("Order", (
        _id,
        _user,
        _tokenGet,
        _valueGet,
        _tokenGive,
        _valueGive,
        _timestamp,
        event
    ) => {
        const order = formatOrder(event.args);

        dispatch({
            type: "NEW_ORDER_SUCCESS",
            order,
            event,
        });
    });

    exchange?.on('Cancel', (...args) => {
        const event = args[7];
        const order = formatOrder(event.args);

        dispatch({
            type: 'ORDER_CANCEL_SUCCESS',
            order,
            event
        })
    });

    exchange?.on('Trade', (...args) => {
        const event = args[8];
        const order = formatOrder(event.args);

        dispatch({
            type: 'ORDER_FILL_SUCCESS',
            order,
            event   
        })
    })
}

export const orderTokens = async (provider, exchange, orderType, tokens, amount, price, dispatch) => {
    const signer = await provider.getSigner();
    let transaction;

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
            await transaction.wait();
        } else {
            transaction = await exchange
                .connect(signer)
                .makeOrder(
                    tokens[1].address,
                    parseTokens(amount * price),
                    tokens[0].address,
                    parseTokens(amount)
                );
            await transaction.wait();
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

    try {

        // fetch cancelled orders
        const cancelledOrdersLogs = await exchange.queryFilter('Cancel');
        const cancelledOrders = cancelledOrdersLogs.map(cancelledOrdersLog => formatOrder(cancelledOrdersLog.args));
    
        dispatch({
            type: 'CANCELLED_ORDERS_LOADED',
            cancelledOrders
        });
    
        // fetch filled orders
        const filledOrdersLogs = await exchange.queryFilter('Trade');
        const filledOrders = filledOrdersLogs.map(filledOrdersLog => formatOrder(filledOrdersLog.args));
    
        dispatch({
            type: 'FILLED_ORDERS_LOADED',
            filledOrders
        });
    
        // fetch all orders
        const allOrderLogs = await exchange.queryFilter('Order');
        const allOrders = allOrderLogs.map(orderLog => formatOrder(orderLog.args));
        
        dispatch({
            type: 'ALL_ORDERS_LOADED',
            allOrders
        })
    } catch (err) {
        console.error(err);
    }

}

export const cancelOrder = async (orderId, exchange, provider, dispatch) => {
    
    dispatch({
        type: 'ORDER_CANCEL_REQUEST'
    });

    try {
        const signer = await provider.getSigner();
        const transaction = await exchange.connect(signer).cancelOrder(orderId);
        await transaction.wait();
    } catch (err) {
        console.log(err);

        dispatch({
            type: 'ORDER_CANCEL_FAIL',
        })
    }    
}

export const fillOrder = async (orderId, exchange, provider, dispatch) => {
    dispatch({ type: 'ORDER_FILL_REQUEST' });

    try {
        const signer = await provider.getSigner();

        const transaction = await exchange.connect(signer).fillOrder(orderId);
        await transaction.wait();
    } catch (err) {
        console.error(err);

        dispatch({ type: 'ORDER_FILL_FAIL' });
    }
}
