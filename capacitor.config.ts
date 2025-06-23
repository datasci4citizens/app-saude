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
    },
};

export default config;
