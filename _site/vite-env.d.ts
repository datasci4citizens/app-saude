/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_API_BASE_URL?: string;
    // adicione outras variáveis conforme necessário
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
