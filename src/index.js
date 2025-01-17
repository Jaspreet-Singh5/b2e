import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import './App.css';
import { Provider } from 'react-redux';
import store from './store/store';
import { Web3ConnectionProvicer } from './contexts/web3Connection.context';
import { TokensContractsProvider } from './contexts/tokensContracts.context';
import { ExchangeContractProvider } from './contexts/exchangeContract.context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Web3ConnectionProvicer>
        <TokensContractsProvider>
          <ExchangeContractProvider>
            <App />
          </ExchangeContractProvider>
        </TokensContractsProvider>
      </Web3ConnectionProvicer>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
