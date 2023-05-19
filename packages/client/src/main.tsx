import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <GoogleOAuthProvider clientId="920265659839-vu93dpp83vk1gaotvq5psjeeobjkbmlt.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
);
