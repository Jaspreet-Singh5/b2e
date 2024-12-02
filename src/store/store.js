import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

// Import reducers
import { provider, tokens } from './reducers';

const rootReducer = combineReducers({
    provider,
    tokens
});

const initialState = {};

const middleware = [thunk];

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(...middleware),
    devTools: process.env.NODE_ENV !== 'production'
});

export default store;
