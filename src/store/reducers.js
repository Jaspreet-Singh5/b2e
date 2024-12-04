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
    symbols: [] 
};

export const tokens = (state = DEFAULT_TOKENS_STATE, action) => {
    switch (action.type) {
        case 'TOKENS_LOADED':
            return {
                ...state,
                loaded: true
            }
        case 'SYMBOL_LOADED':
            return {
                ...state,
                symbols: [
                    ...state.symbols,
                    action.symbol
                ]
            }
        default:
            return state;
    }
}

export const exchange = (state = { loaded: false }, action) => {
    switch (action.type) {
        case 'EXCHANGE_LOADED':
            return {
                ...state,
                loaded: true
            }
        default:
            return state;
    }
}
