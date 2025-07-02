import type { CapacitorConfig } from '@capacitor/cli';
import dotenv from 'dotenv';

dotenv.config();

const config: CapacitorConfig = {
    appId: 'br.unicamp.ic.saude',
    appName: 'saude',
    webDir: 'dist',
    plugins: {
        GoogleAuth: {
            scopes: ['profile', 'email'],
            serverClientId: process.env.VITE_GOOGLE_CLIENT_ID,
            grantOfflineAccess: true,
            forceCodeForRefreshToken: true,
        },
        SplashScreen: {
            launchShowDuration: 3000,
            autoHide: true,
            backgroundColor: '#3b82f6',
            spinnerColor: '#f59e0b',
            splashFullScreen: true,
            splashImmersive: true,
        },
    },
};

export default config;
