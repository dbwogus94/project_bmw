import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthService from './service/auth';
import TweetService from './service/tweet';
import BusService from './service/bus';
import MetroService from './service/metro';
import StopService from './service/stop';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthErrorEventBus } from './context/AuthContext';
import HttpClient from './network/http';
import Storage from './db/storage';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = new AuthErrorEventBus();
const userStorage = new Storage();
const httpClient = new HttpClient(baseURL, userStorage, authErrorEventBus);

const authService = new AuthService(httpClient, userStorage);
const tweetService = new TweetService(baseURL);
const busService = new BusService(httpClient);
const metroService = new MetroService();
const stopService = new StopService();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
        <App //
          tweetService={tweetService}
          busService={busService}
          metroService={metroService}
          stopService={stopService}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
