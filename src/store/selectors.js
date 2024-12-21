import { createSelector } from 'reselect';
import moment from 'moment';
const decorateOrder = (order, tokens) => {
    let token0Amount, token1Amount;

    if (order.tokenGet === tokens[0].address) {
        token0Amount = order.valueGet;
        token1Amount = order.valueGive;
    } else {
        token0Amount = order.valueGive;
        token1Amount = order.valueGet;
    }

    // calc token price to 5 decimal places
    const precision = 10000;
    let tokenPrice = token1Amount / token0Amount;
    tokenPrice = Math.round(tokenPrice * precision) / precision;

    return {
        ...order,
        token0Amount,
        token1Amount,
        tokenPrice,
        formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ssa d MMM D'),
    }
}

export const orderBookSelector = createSelector([
    state => state.exchange.allOrders.data,
    (_, tokens) => tokens
], (orders, tokens) => {
    if (!tokens[0] || !tokens[1]) return;
    
    // filter by selected trading pair
    const tokenAddresses = new Set([tokens[0].address, tokens[1].address])

    orders = orders.filter(order => (
        tokenAddresses.has(order.tokenGet) ||
        tokenAddresses.has(order.tokenGive)
    ));

    return orders;
})
