import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './globals.css';
import '@fontsource-variable/inter';
import { App } from './App';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Falha ao encontrar raiz do projeto.');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
