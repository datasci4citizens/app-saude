import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './globals.css';
import '@fontsource-variable/inter';
import { App } from './App';

import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";

// Initialize the Google Auth plugin for mobile platforms
if (Capacitor.isNativePlatform()) {
  GoogleAuth.initialize({
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scopes: ["profile", "email"],
    grantOfflineAccess: true,
  });
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Falha ao encontrar raiz do projeto.");
}

// Initialize the Google OAuth provider for web platforms
createRoot(root).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
