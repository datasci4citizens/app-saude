/* enhanced request function with 401 retry logic - FIXED VERSION */
import { ApiError } from './ApiError';
import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';
import { CancelablePromise } from './CancelablePromise';
import type { OnCancel } from './CancelablePromise';
import type { OpenAPIConfig } from './OpenAPI';
import { AuthService } from '../services/AuthService';
import type { TokenRefresh } from '../models/TokenRefresh';
import { getCurrentAccount } from '@/contexts/AppContext';

export const isDefined = <T>(
  value: T | null | undefined,
): value is Exclude<T, null | undefined> => {
  return value !== undefined && value !== null;
};

export const isString = (value: any): value is string => {
  return typeof value === 'string';
};

export const isStringWithValue = (value: any): value is string => {
  return isString(value) && value !== '';
};

export const isBlob = (value: any): value is Blob => {
  return (
    typeof value === 'object' &&
    typeof value.type === 'string' &&
    typeof value.stream === 'function' &&
    typeof value.arrayBuffer === 'function' &&
    typeof value.constructor === 'function' &&
    typeof value.constructor.name === 'string' &&
    /^(Blob|File)$/.test(value.constructor.name) &&
    /^(Blob|File)$/.test(value[Symbol.toStringTag])
  );
};

export const isFormData = (value: any): value is FormData => {
  return value instanceof FormData;
};

export const base64 = (str: string): string => {
  try {
    return btoa(str);
  } catch (err) {
    // @ts-ignore
    return Buffer.from(str).toString('base64');
  }
};

export const getQueryString = (params: Record<string, any>): string => {
  const qs: string[] = [];

  const append = (key: string, value: any) => {
    qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  };

  const process = (key: string, value: any) => {
    if (isDefined(value)) {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          process(key, v);
        });
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([k, v]) => {
          process(`${key}[${k}]`, v);
        });
      } else {
        append(key, value);
      }
    }
  };

  Object.entries(params).forEach(([key, value]) => {
    process(key, value);
  });

  if (qs.length > 0) {
    return `?${qs.join('&')}`;
  }

  return '';
};

const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
  const encoder = config.ENCODE_PATH || encodeURI;

  const path = options.url
    .replace('{api-version}', config.VERSION)
    .replace(/{(.*?)}/g, (substring: string, group: string) => {
      if (options.path?.hasOwnProperty(group)) {
        return encoder(String(options.path[group]));
      }
      return substring;
    });

  const url = `${config.BASE}${path}`;
  if (options.query) {
    return `${url}${getQueryString(options.query)}`;
  }
  return url;
};

export const getFormData = (options: ApiRequestOptions): FormData | undefined => {
  if (options.formData) {
    const formData = new FormData();

    const process = (key: string, value: any) => {
      if (isString(value) || isBlob(value)) {
        formData.append(key, value);
      } else {
        formData.append(key, JSON.stringify(value));
      }
    };

    Object.entries(options.formData)
      .filter(([_, value]) => isDefined(value))
      .forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => process(key, v));
        } else {
          process(key, value);
        }
      });

    return formData;
  }
  return undefined;
};

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;

export const resolve = async <T>(
  options: ApiRequestOptions,
  resolver?: T | Resolver<T>,
): Promise<T | undefined> => {
  if (typeof resolver === 'function') {
    return (resolver as Resolver<T>)(options);
  }
  return resolver;
};

export const getHeaders = async (
  config: OpenAPIConfig,
  options: ApiRequestOptions,
): Promise<Headers> => {
  const [token, username, password, additionalHeaders] = await Promise.all([
    resolve(options, config.TOKEN),
    resolve(options, config.USERNAME),
    resolve(options, config.PASSWORD),
    resolve(options, config.HEADERS),
  ]);

  const headers = Object.entries({
    Accept: 'application/json',
    ...additionalHeaders,
    ...options.headers,
  })
    .filter(([_, value]) => isDefined(value))
    .reduce(
      (headers, [key, value]) => ({
        ...headers,
        [key]: String(value),
      }),
      {} as Record<string, string>,
    );

  if (isStringWithValue(token)) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (isStringWithValue(username) && isStringWithValue(password)) {
    const credentials = base64(`${username}:${password}`);
    headers['Authorization'] = `Basic ${credentials}`;
  }

  if (options.body !== undefined) {
    if (options.mediaType) {
      headers['Content-Type'] = options.mediaType;
    } else if (isBlob(options.body)) {
      headers['Content-Type'] = options.body.type || 'application/octet-stream';
    } else if (isString(options.body)) {
      headers['Content-Type'] = 'text/plain';
    } else if (!isFormData(options.body)) {
      headers['Content-Type'] = 'application/json';
    }
  }

  return new Headers(headers);
};

export const getRequestBody = (options: ApiRequestOptions): any => {
  if (options.body !== undefined) {
    if (options.mediaType?.includes('/json')) {
      return JSON.stringify(options.body);
    } else if (isString(options.body) || isBlob(options.body) || isFormData(options.body)) {
      return options.body;
    } else {
      return JSON.stringify(options.body);
    }
  }
  return undefined;
};

export const sendRequest = async (
  config: OpenAPIConfig,
  options: ApiRequestOptions,
  url: string,
  body: any,
  formData: FormData | undefined,
  headers: Headers,
  onCancel: OnCancel,
): Promise<Response> => {
  const controller = new AbortController();

  const request: RequestInit = {
    headers,
    body: body ?? formData,
    method: options.method,
    signal: controller.signal,
  };

  if (config.WITH_CREDENTIALS) {
    request.credentials = config.CREDENTIALS;
  }

  onCancel(() => controller.abort());

  return await fetch(url, request);
};

export const getResponseHeader = (
  response: Response,
  responseHeader?: string,
): string | undefined => {
  if (responseHeader) {
    const content = response.headers.get(responseHeader);
    if (isString(content)) {
      return content;
    }
  }
  return undefined;
};

export const getResponseBody = async (response: Response): Promise<any> => {
  if (response.status !== 204) {
    try {
      const contentType = response.headers.get('Content-Type');
      if (contentType) {
        const jsonTypes = ['application/json', 'application/problem+json'];
        const isJSON = jsonTypes.some((type) => contentType.toLowerCase().startsWith(type));
        if (isJSON) {
          return await response.json();
        } else {
          return await response.text();
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  return undefined;
};

// VERSÃO CORRIGIDA DO CONTROLE DE REFRESH
interface RefreshState {
  isRefreshing: boolean;
  promise: Promise<string> | null;
  attempts: number;
  lastAttemptTime: number;
}

const refreshState: RefreshState = {
  isRefreshing: false,
  promise: null,
  attempts: 0,
  lastAttemptTime: 0,
};

const MAX_REFRESH_ATTEMPTS = 3;
const REFRESH_COOLDOWN = 5000; // 5 segundos

export async function refreshToken(config: OpenAPIConfig): Promise<string> {
  console.log('Iniciando refresh de token...');

  const now = Date.now();

  // Reset attempts se passou do cooldown
  if (now - refreshState.lastAttemptTime > REFRESH_COOLDOWN) {
    refreshState.attempts = 0;
  }

  // Verifica se excedeu tentativas máximas
  if (refreshState.attempts >= MAX_REFRESH_ATTEMPTS) {
    console.error('Máximo de tentativas de refresh excedido');
    throw new Error('Max refresh attempts exceeded');
  }

  refreshState.attempts++;
  refreshState.lastAttemptTime = now;

  const currentAccount = getCurrentAccount();

  if (!currentAccount?.refreshToken) {
    throw new Error('No refresh token available');
  }

  const refresh = await resolve({} as ApiRequestOptions, config.REFRESH_TOKEN);
  const tokenRefresh: TokenRefresh = {
    access: '',
    refresh: isStringWithValue(refresh) ? refresh : currentAccount.refreshToken,
  };

  console.log('Fazendo refresh do token...');

  const previousToken = config.TOKEN;
  config.TOKEN = '';
  const response = await AuthService.authTokenRefreshCreate(tokenRefresh);
  config.TOKEN = previousToken; // Restaura o token original em caso de falha

  if (!response.access) {
    throw new Error('Failed to refresh token - no access token returned');
  }

  config.TOKEN = response.access;

  // Atualiza localStorage
  if (currentAccount) {
    const savedAccounts = localStorage.getItem('saved_accounts');
    if (savedAccounts) {
      try {
        const accounts = JSON.parse(savedAccounts);
        const updatedAccounts = accounts.map((acc: any) =>
          acc.userId === currentAccount.userId
            ? { ...acc, accessToken: response.access, refreshToken: response.refresh }
            : acc,
        );
        localStorage.setItem('saved_accounts', JSON.stringify(updatedAccounts));
      } catch (error) {
        console.error('Erro ao atualizar tokens no localStorage:', error);
      }
    }
  }

  console.log('Token refreshed successfully');
  return response.access;
}

async function handleTokenRefresh(config: OpenAPIConfig): Promise<string> {
  // Se já está refreshing, aguarda o resultado
  if (refreshState.isRefreshing && refreshState.promise) {
    return await refreshState.promise;
  }

  // Inicia novo refresh
  refreshState.isRefreshing = true;
  refreshState.promise = refreshToken(config).finally(() => {
    refreshState.isRefreshing = false;
    refreshState.promise = null;
  });

  return await refreshState.promise;
}

export const catchErrorCodes = async (
  options: ApiRequestOptions,
  result: ApiResult,
  config: OpenAPIConfig,
  onCancel: OnCancel,
  isRetry: boolean = false,
): Promise<ApiResult> => {
  const errors: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    ...options.errors,
  };

  const currentAccount = getCurrentAccount();

  // CONDIÇÕES MAIS RIGOROSAS PARA RETRY
  if (
    result.status === 401 &&
    !isRetry &&
    currentAccount?.refreshToken &&
    refreshState.attempts < MAX_REFRESH_ATTEMPTS
  ) {
    console.log('401 detectado, tentando refresh do token...');

    try {
      const newToken = await handleTokenRefresh(config);

      // Verifica se realmente conseguiu um novo token
      if (!newToken || newToken === config.TOKEN) {
        throw new Error('Failed to get new token');
      }

      console.log('Token refreshed, tentando requisição novamente...');

      // Retry da requisição original
      const url = getUrl(config, options);
      const formData = getFormData(options);
      const body = getRequestBody(options);
      const headers = await getHeaders(config, options);

      if (!onCancel.isCancelled) {
        const retryResponse = await sendRequest(
          config,
          options,
          url,
          body,
          formData,
          headers,
          onCancel,
        );
        const retryResponseBody = await getResponseBody(retryResponse);
        const retryResponseHeader = getResponseHeader(retryResponse, options.responseHeader);

        const retryResult: ApiResult = {
          url,
          ok: retryResponse.ok,
          status: retryResponse.status,
          statusText: retryResponse.statusText,
          body: retryResponseHeader ?? retryResponseBody,
        };

        // Se ainda der 401 no retry, não tenta novamente
        if (retryResult.status === 401) {
          console.error('Token refresh aparentemente não funcionou, ainda recebendo 401');
          throw new Error('Token refresh failed - still unauthorized');
        }

        // Recursive call com isRetry = true
        return await catchErrorCodes(options, retryResult, config, onCancel, true);
      }
    } catch (refreshError) {
      console.error('Erro no refresh do token:', refreshError);

      // Reset do estado em caso de erro
      refreshState.isRefreshing = false;
      refreshState.promise = null;

      throw new ApiError(options, result, 'Session expired - please login again');
    }
  }

  // Handle outros erros normalmente
  const error = errors[result.status];
  if (error) {
    throw new ApiError(options, result, error);
  }

  if (!result.ok) {
    const errorStatus = result.status ?? 'unknown';
    const errorStatusText = result.statusText ?? 'unknown';
    const errorBody = (() => {
      try {
        return JSON.stringify(result.body, null, 2);
      } catch (e) {
        return undefined;
      }
    })();

    throw new ApiError(
      options,
      result,
      `Generic Error: status: ${errorStatus}; status text: ${errorStatusText}; body: ${errorBody}`,
    );
  }

  return result;
};

/**
 * Enhanced Request method with 401 retry logic
 * @param config The OpenAPI configuration object
 * @param options The request options from the service
 * @returns CancelablePromise<T>
 * @throws ApiError
 */
export const request = <T>(
  config: OpenAPIConfig,
  options: ApiRequestOptions,
): CancelablePromise<T> => {
  return new CancelablePromise(async (resolve, reject, onCancel) => {
    try {
      const url = getUrl(config, options);
      const formData = getFormData(options);
      const body = getRequestBody(options);
      const headers = await getHeaders(config, options);

      if (!onCancel.isCancelled) {
        const response = await sendRequest(config, options, url, body, formData, headers, onCancel);
        const responseBody = await getResponseBody(response);
        const responseHeader = getResponseHeader(response, options.responseHeader);

        const result: ApiResult = {
          url,
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          body: responseHeader ?? responseBody,
        };

        const finalResult = await catchErrorCodes(options, result, config, onCancel);
        resolve(finalResult.body);
      }
    } catch (error) {
      reject(error);
    }
  });
};
