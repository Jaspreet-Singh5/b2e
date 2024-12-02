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

export const tokens = (state = { loaded: false }, action) => {
    switch (action.type) {
        case 'TOKEN_LOADED':
            return {
                ...state,
                loaded: true
            }
        case 'SYMBOL_LOADED':
            return {
                ...state,
                symbol: action.symbol
            }
        default:
            return state;
    }
}
