import type { CapacitorConfig } from '@capacitor/cli';
import { Capacitor } from '@capacitor/core';
import dotenv from 'dotenv';

dotenv.config();

const clientId = Capacitor.isNativePlatform()
  ? process.env.VITE_GOOGLE_CLIENT_ID_MOBILE
  : process.env.VITE_GOOGLE_CLIENT_ID;

console.log("GOOGLE ID:", clientId);

const config: CapacitorConfig = {
  appId: 'br.unicamp.ic.saude',
  appName: 'saude',
  webDir: 'dist',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      clientId: clientId,
      grantOfflineAccess: true,
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
