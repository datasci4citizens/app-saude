import { AuthService } from "../services/AuthService";
import type { TokenRefresh } from "../models/TokenRefresh";

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
let requestQueue: ((token: string) => void)[] = [];

const originalFetch = globalThis.fetch;

export const isString = (value: any): value is string => {
    return typeof value === 'string';
};

export const isStringWithValue = (value: any): value is string => {
    return isString(value) && value !== '';
};

function subscribeToTokenRefresh(callback: (token: string) => void) {
  requestQueue.push(callback);
}

function notifySubscribers(newToken: string) {
  requestQueue.forEach((cb) => cb(newToken));
  requestQueue = [];
}

async function refreshToken(): Promise<string> {
  console.log("Iniciando refresh de token...");
  const refresh = localStorage.getItem("refreshToken");

  if (!refresh) throw new Error("Refresh token não encontrado");

  const tokenRefresh: TokenRefresh = {
    access: localStorage.getItem("accessToken") || "",
    refresh,
  };

  console.log("Token de refresh:", tokenRefresh);

  localStorage.removeItem("accessToken");

  const res = await AuthService.authTokenRefreshCreate(tokenRefresh);

  localStorage.setItem("accessToken", res.access);
  localStorage.setItem("refreshToken", res.refresh);

  return res.access;
}

export const customFetch: typeof fetch = async (input, init = {}) => {
  const injectAuth = (headers: HeadersInit = {}): HeadersInit => ({
    ...headers,
    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
  });

  const doRequest = () => {
    const isJson = typeof init.body === "string" && init.body.trim().startsWith("{");

    return originalFetch(input, {
      ...init,
      headers: {
        ...(isStringWithValue(localStorage.getItem("accessToken"))) && injectAuth(init.headers),
        ...(isJson ? { "Content-Type": "application/json" } : {}),
      },
    });
  };

  let response = await doRequest();

  if (response.status !== 401) return response;

  // Token expirado. Tenta refresh.
  if (!isRefreshing) {
    isRefreshing = true;
    console.log("Token expirado, tentando refresh...");
    await refreshToken()
      .then((newToken) => {
        notifySubscribers(newToken);
        return newToken;
      })
      .finally(() => {
        isRefreshing = false;
      });
  }

  return new Promise<Response>((resolve, reject) => {
    subscribeToTokenRefresh(async () => {
      try {
        const retryResponse = await doRequest();

        // Evita loops infinitos se o refresh também falhar
        if (retryResponse.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
          return reject(new Error("Token expirado após refresh"));
        }

        resolve(retryResponse);
      } catch (err) {
        reject(err);
      }
    });
  });
};
