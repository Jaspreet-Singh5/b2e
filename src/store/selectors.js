import { createSelector } from 'reselect';
import moment from 'moment';
import { OrderType } from '../enums/orderType';
import _ from 'lodash';


const GREEN = '#25CE8F';
const RED = '#F45353';

// INPUT SELECTORS
const account = state => state.provider.account;
const  filledOrders = state => state.exchange.filledOrders.data;
const events = state => state.exchange.events;

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

// ------------------------------------------------
// ALL FILLED ORDERS

const decorateFilledOrder = (order, prevOrder = order) => {
    return {
        ...order,
        tokenPriceClass: (order?.tokenPrice >= prevOrder?.tokenPrice ? GREEN : RED),
    }
}

const decorateFilledOrders = (orders, tokens) => {
    let prevOrder;

    return (
        orders.map(order => {
            order = decorateOrder(order, tokens);
            order = decorateFilledOrder(order, prevOrder);

            prevOrder = order; // update the previous order
            
            return order;
        })
    )
}

export const filledOrdersSelector = createSelector(
    state => state.exchange.filledOrders.data,
    (_, tokens) => tokens,
    (orders, tokens) => {
        if (!orders?.length > 0 || !tokens[0] || !tokens[1]) return;

        // filter orders by selected tokens pair
        orders = filterOrdersByTokens(orders, tokens);

        // sort orders by time asc for price comparison
        orders.sort((a,b ) => +a.timestamp - +b.timestamp);

        // decorate the orders
        orders = decorateFilledOrders(orders, tokens);

        // sort orders by time desc for display
        orders.sort((a, b) => +b.timestamp - +a.timestamp);

        return orders;
    }
)

// ------------------------------
// MY OPEN ORDERS

export const myOpenOrdersSelector = createSelector(
    openOrders,
    account,
    (_, tokens) => tokens,
    (orders, user, tokens) => {
        if (!orders?.length > 0 || !tokens[0] || !tokens[1]) return;

        // filter orders created by current user
        orders = orders.filter(order => order.user === user);

        // filter by selected token pair
        orders = filterOrdersByTokens(orders, tokens);

        // deocorate orders - add display attributes
        orders = decorateOrderBookOrders(orders, tokens);

        // sort by time desc
        orders.sort((a, b) => +b.timestamp - +a.timestamp);

        return orders;
    }
)

// ------------------------------
// MY FILLED ORDERS

const decorateMyFilledOrder = (order, account, tokens) => {
    const myOrder = order.creator === account;
    let orderType;

    if (myOrder) {
        orderType = order.tokenGet === tokens[0].address ? OrderType.BUY : OrderType.SELL;
    } else {
        orderType = order.tokenGet === tokens[0].address ? OrderType.SELL : OrderType.BUY;
    }

    return {
        ...order,
        orderType,
        orderSign: (orderType === OrderType.BUY ? '+' : '-'),
        orderTypeClass: (orderType === OrderType.BUY ? GREEN : RED)
    }
}

const decorateMyFilledOrders = (orders, account, tokens) => (
    orders.map(order => {
        order = decorateOrder(order, tokens);
        order = decorateMyFilledOrder(order, account, tokens);

        return order;
    })
);

export const myFilledOrdersSelector = createSelector(
    account,
    (_, tokens) => tokens,
    filledOrders,
    (account, tokens, orders) => {
        if (!tokens[0] || !tokens[1]) return;

        // filter orders by current user
        orders = orders.filter(order => (
            order.user === account ||
            order.creator === account
        ));

        // filter orders by selected token pair
        orders = filterOrdersByTokens(orders, tokens);

        // sort by time desc
        orders.sort((a, b) => +b.timestamp - +a.timestamp);

        // decorate orders - add display attributes
        orders = decorateMyFilledOrders(orders, account, tokens);

        return orders;
    }
)

// ----------------------------
// MY EVENTS

export const myEventsSelector = createSelector(
    account,
    events,
    (account, events) => {
        return events?.filter(event => event.args.user === account);
    }
);
