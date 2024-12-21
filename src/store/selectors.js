import { createSelector } from 'reselect';
import moment from 'moment';
import { OrderType } from '../enums/orderType';


const GREEN = '#25CE8F';
const RED = '#F45353';

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

const decorateOrderBookOrder = (order, tokens) => {
    const orderType = order.tokenGet === tokens[0].address ? OrderType.BUY : OrderType.SELL;

    return {
        ...order,
        orderType,
        orderTypeClass: (orderType === OrderType.BUY ? GREEN : RED),
        orderFillAction: (orderType === OrderType.BUY ? OrderType.SELL : OrderType.BUY),
    }
}

const decorateOrderBookOrders = (orders, tokens) => {
    return (
        orders.map(order => {
            order = decorateOrder(order, tokens);
            order = decorateOrderBookOrder(order, tokens);
    
            return order;
        })
    );
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

    // decorate orders
    orders = decorateOrderBookOrders(orders, tokens);

    // sort orders by token price
    orders.sort((a, b) => {
        return b.tokenPrice - a.tokenPrice;
    });

    // group orders by order type
    orders = Object.groupBy(orders, order => order.orderType);
    
    return orders;
})
