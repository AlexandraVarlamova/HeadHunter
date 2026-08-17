import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from "./store/store";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import {BrowserRouter as Router} from "react-router-dom"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider>
        <Router>
        <App />
        </Router>
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
