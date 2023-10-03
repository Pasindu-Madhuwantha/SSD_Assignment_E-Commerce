import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import store from './store';

const root = document.getElementById('root');

const appRoot = ReactDOM.createRoot(root);

appRoot.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="870373054921-iddblnq7kidqp35qou604lkrbbhjlo7m.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </Provider>
);
