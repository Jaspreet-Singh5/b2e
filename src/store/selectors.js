import { createSelector } from 'reselect';

export const orderBookSelector = createSelector([
    state => state.exchange.allOrders.data,
    (_, tokens) => tokens
], (orders, tokens) => {
    if (!tokens[0] || !tokens[1]) return;
    
    // filter by selected trading pair
    const tokenAddresses = new Set([tokens[0].address, tokens[1].address])
    
    const filteredOrders = orders.filter(order => (
        tokenAddresses.has(order.tokenGet) ||
        tokenAddresses.has(order.tokenGive)
    ));
    return filteredOrders;
})
