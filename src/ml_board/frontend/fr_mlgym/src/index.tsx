import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from 'src/app/App';
import { BrowserRouter } from 'react-router-dom';
import store from 'src/app/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>
);
