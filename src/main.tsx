import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './globals.css';
import React from 'react';
import '@fontsource-variable/inter';
import { App } from './App';
import { GoogleOAuthProvider } from '@react-oauth/google'
import 'mingcute_icon/font/Mingcute.css'

const root = document.getElementById('root');

if (!root) {
  throw new Error('Falha ao encontrar raiz do projeto.');
}

createRoot(root).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)