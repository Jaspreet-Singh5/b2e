import { createSelector } from 'reselect';
import moment from 'moment';
import { OrderType } from '../enums/orderType';
import _ from 'lodash';


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

const openOrders = state => {
    const allOrders = state.exchange.allOrders.data;
    const filledOrders = state.exchange.filledOrders.data;
    const cancelledOrders = state.exchange.cancelledOrders.data;

    return allOrders.filter(order => !(
        filledOrders.some(filledOrder => filledOrder.id === order.id) ||
        cancelledOrders.some(cancelledOrder => cancelledOrder.id === order.id)
    ));
};

const filterOrdersByTokens = (orders, tokens) => {
    const tokenAddresses = new Set([tokens[0].address, tokens[1].address])

    return orders.filter(order => (
        tokenAddresses.has(order.tokenGet) &&
        tokenAddresses.has(order.tokenGive)
    ));
}

// -------------------------------------------------------
// ORDER BOOK

export const orderBookSelector = createSelector([
    openOrders,
    (_, tokens) => tokens
], (orders, tokens) => {
    if (!orders?.length > 0 || !tokens[0] || !tokens[1]) return;
    
    // filter orders by selected trading pair
    orders = filterOrdersByTokens(orders, tokens);

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

// -------------------------------------------------------
// PRICE CHART

const buildGraphData = (orders, interval) => {
    // group the orders by interval for the graph
    orders = Object.groupBy(orders, order => moment.unix(order.timestamp).startOf(interval).format());

    // get each hour where data exists
    const hours = Object.keys(orders);

    // build the graph series
    return hours.map(hour => {
        // fetch all orders from current hour
        const hourOrders = orders[hour];

        // calculate price values: open, high, low, close            
        const open = hourOrders[0];
        const high = _.maxBy(hourOrders, 'tokenPrice');
        const low = _.minBy(hourOrders, 'tokenPrice');
        const close = _.last(hourOrders);

        return {
            x: new Date(hour),
            y: [
                open.tokenPrice,
                high.tokenPrice,
                low.tokenPrice,
                close.tokenPrice
            ]
        }
    });
}

export const priceChartSelector = createSelector(
    state => state.exchange.filledOrders.data,
    (_, tokens) => tokens,
    (orders, tokens) => {
        if (!orders?.length > 0 || !tokens[0] || !tokens[1]) return;

        // filter orders by selected trading pair
        orders = filterOrdersByTokens(orders, tokens);

        // sort orders by date asc to compare history
        orders = _.sortBy(orders, order => +order.timestamp);

        // decorate orders - add displat attributes
        orders = orders.map(order => decorateOrder(order, tokens));

        // get last 2 orders for final price and price change
        const [secondLastOrder, lastOrder] = orders.slice(orders.length -  2);
        
        // get last order price
        const lastOrderPrice = lastOrder?.tokenPrice ?? 0;

        // get second last order price
        const secondLastOrderPrice = secondLastOrder?.tokenPrice ?? 0;

        return ({
            lastOrderPrice,
            lastPriceChange: (lastOrderPrice >= secondLastOrderPrice ? '+' : '-'),
            series: [{
                data: buildGraphData(orders, 'hour')
            }]
        });
    }
)
