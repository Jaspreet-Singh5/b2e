import { createSelector } from 'reselect';

export const orderBookSelector = createSelector([
    state => state.exchange.allOrders.data,
    (_, tokens) => tokens
], (orders, tokens) => {
})
