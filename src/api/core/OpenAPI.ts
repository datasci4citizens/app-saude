import type { ApiRequestOptions } from './ApiRequestOptions';
import { Capacitor } from '@capacitor/core';
import { getCurrentAccount } from '../../contexts/AppContext';

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;

export type OpenAPIConfig = {
  BASE: string;
  VERSION: string;
  WITH_CREDENTIALS: boolean;
  CREDENTIALS: 'include' | 'omit' | 'same-origin';
  TOKEN: string | Resolver<string>;
  REFRESH_TOKEN: string | Resolver<string>;
  USERNAME?: string | Resolver<string> | undefined;
  PASSWORD?: string | Resolver<string> | undefined;
  HEADERS?: Headers | Resolver<Headers> | undefined;
  ENCODE_PATH?: ((path: string) => string) | undefined;
};

const isMobile = Capacitor.isNativePlatform();
let apiBaseUrl: string;

if (import.meta.env.VITE_USE_STAGING === 'true') {
  apiBaseUrl = import.meta.env.VITE_SERVER_STAGING_URL || '';
} else if (isMobile) {
  apiBaseUrl = import.meta.env.VITE_SERVER_PROD_URL || '';
} else {
  apiBaseUrl = import.meta.env.VITE_SERVER_LOCAL_URL || '';
}

export const OpenAPI: OpenAPIConfig = {
  BASE: apiBaseUrl,
  VERSION: '0.0.0',
  WITH_CREDENTIALS: true,
  CREDENTIALS: 'include',
  // IMPORTANTE: usar arrow functions diretamente para sempre buscar o valor atual
  TOKEN: async (): Promise<string> => {
    try {
      const currentAccount = getCurrentAccount();
      console.log('Obtendo token de acesso para o usuário:', currentAccount?.userId);
      const token = currentAccount?.accessToken;

      if (!token) {
        console.warn('Nenhum token de acesso encontrado');
        return '';
      }

      console.log(`Usando token do usuário: ${currentAccount.userId}`);
      return token;
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return '';
    }
  },

  REFRESH_TOKEN: async (): Promise<string> => {
    try {
      const currentAccount = getCurrentAccount();
      const refreshToken = currentAccount?.refreshToken;

      if (!refreshToken) {
        console.warn('Nenhum refresh token encontrado');
        return '';
      }

      console.log(`Usando refresh token do usuário: ${currentAccount.userId}`);
      return refreshToken;
    } catch (error) {
      console.error('Erro ao obter refresh token:', error);
      return '';
    }
  },

  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
};

export function debugCurrentTokens(): void {
  const currentAccount = getCurrentAccount();
  console.log('=== DEBUG TOKENS ===');
  console.log('Current Account:', currentAccount?.userId);
  console.log(
    'Access Token (primeiros 20 chars):',
    currentAccount?.accessToken?.substring(0, 20) + '...',
  );
  console.log(
    'Refresh Token (primeiros 20 chars):',
    currentAccount?.refreshToken?.substring(0, 20) + '...',
  );
  console.log('===================');
}
