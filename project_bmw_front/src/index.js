import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthService from './service/auth';
import BmGroupService from './service/bm-group';
import BusService from './service/bus';
import MetroService from './service/metro';
import StationService from './service/station';
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
const bmGroupService = new BmGroupService(httpClient);
const busService = new BusService(httpClient);
const metroService = new MetroService();
const stationService = new StationService();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
        <App //
          bmGroupService={bmGroupService}
          busService={busService}
          metroService={metroService}
          stationService={stationService}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
