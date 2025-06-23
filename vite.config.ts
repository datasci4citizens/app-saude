// biome-ignore lint/correctness/noNodejsModules: roda no node
import path from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        proxy: {
            '/auth': 'http://localhost:8000',
            '/admin': 'http://localhost:8000',
            '/accounts': 'http://localhost:8000',
        },
    },
});
