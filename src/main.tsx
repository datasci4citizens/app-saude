import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './globals.css';
import '@fontsource-variable/inter';
import 'mingcute_icon/font/Mingcute.css'
import { App } from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Falha ao encontrar raiz do projeto.');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
