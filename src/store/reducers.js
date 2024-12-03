export const provider = (state = {}, action) => {
    switch (action.type) {
        case 'NETWORK_LOADED':
            return {
                ...state,
                chainId: action.chainId
            }
        case 'ACCOUNT_LOADED':
            return {
                ...state,
                account: action.account
            }
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
