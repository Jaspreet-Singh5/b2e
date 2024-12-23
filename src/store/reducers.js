import { TransactionType } from "../enums/transactionType";

export const provider = (state = {}, action) => {
    switch (action.type) {
        case 'NETWORK_LOADED':
            return {
                ...state,
                chainId: action.chainId
            };
        
        case 'ACCOUNT_LOADED':
            return {
                ...state,
                account: action.account
            };
        
        case 'ETHER_BALANCE_LOADED':
            return {
                ...state,
                balance: action.balance
            };

        default:
            return state;
    }
}

const DEFAULT_TOKENS_STATE = { 
    loaded: false, 
    symbols: [],
    balances: [], 
};

export const tokens = (state = DEFAULT_TOKENS_STATE, action) => {
    switch (action.type) {
        case 'TOKEN1_LOADED':
            return {
                ...state,
                loaded: true,
                symbols: [ action.symbol ]
            }

        case 'TOKEN1_BALANCE_LOADED':
            return {
                ...state,
                balances: [action.balance]
            }

        case 'TOKEN2_LOADED':
            return {
                ...state,
                loaded: true,
                symbols: [ ...state.symbols, action.symbol]
            }
        
        case 'TOKEN2_BALANCE_LOADED':
            return {
                ...state,
                balances: [...state.balances, action.balance]
            }

        default:
            return state;
    }
}

const DEFAULT_EXCHANGE_STATE = { 
    loaded: false, 
    balances: [], 
    events: [],
    allOrders: {
        loaded: false,
        data: []
    },
    cancelledOrders: {
        loaded: false,
        data: []
    },
};

export const exchange = (state = DEFAULT_EXCHANGE_STATE, action) => {
    let isDuplicateOrder, data;
    
    switch (action.type) {
        case 'EXCHANGE_LOADED':
            return {
                ...state,
                loaded: true
            }
        
        // -------------------------------
        // ORDERS LOADED (CANCELLED, FILLED & OPEN)
        case 'ALL_ORDERS_LOADED':
            return {
                ...state,
                allOrders: {
                    loaded: true,
                    data: [ ...action.allOrders ]
                }
            }
    
        // --------------------------------------
        // BALANCE CASES
        case 'EXCHANGE_TOKEN1_BALANCE_LOADED':
            return {
                ...state,
                balances: [action.balance]
            }

        case 'EXCHANGE_TOKEN2_BALANCE_LOADED':
            return {
                ...state,
                balances: [...state.balances, action.balance]
            }
        
        // -------------------------------
        // TRANSFER CASES (DEPOSIT & WITHDRAWS)
        case 'TRANSFER_REQUEST':
            return {
                ...state,
                transaction: {
                    isPending: true,
                    isSuccessful: false,
                    transactionType: TransactionType.TRANSFER
                },
                transferInProgress: true
            }

        case 'TRANSFER_SUCCESS':
            return {
                ...state,
                transaction: {
                    isPending: false,
                    isSuccessful: true,
                    transactionType: TransactionType.TRANSFER
                },
                transferInProgress: false,
                events: [ ...state.events, action.event ]
            }

        case 'TRANSFER_FAIL':
            return {
                ...state,
                transaction: {
                    isPending: false,
                    isSuccessful: false,
                    transactionType: TransactionType.TRANSFER,
                    isError: true
                },
                transferInProgress: false,
            }
        
        // ------------------------------
        // ORDER CASES (BUY & SELL)

        case 'NEW_ORDER_REQUEST':
            return {
                ...state,
                transaction: {
                    isPending: true,
                    isSuccess: false,
                    transactionType: TransactionType.NEW_ORDER
                },
            }            
        
        case 'NEW_ORDER_FAIL':
            return {
                ...state,
                transaction: {
                    isPending: false,
                    isSuccess: false,
                    transactionType: TransactionType.NEW_ORDER,
                    isError: true
                },
            }
        
        case 'NEW_ORDER_SUCCESS':
            // prevent duplicate orders
            isDuplicateOrder = state.allOrders.data.find(order => order.id.toString() === action.order.id.toString());
            
            if (isDuplicateOrder) {
                data = state.allOrders.data;
            } else {
                data = [ ...state.allOrders.data, action.order ]
            }

            return {
                ...state,
                transaction: {
                    isPending: false,
                    isSuccess: true,
                    transactionType: TransactionType.NEW_ORDER,
                },
                events: [ ...state.events, action.event ],
                allOrders: { 
                    ...state.allOrders, 
                    data: data
                },
            }
        
        default:
            return state;
    }
}
