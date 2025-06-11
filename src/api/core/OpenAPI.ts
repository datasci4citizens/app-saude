/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from "./ApiRequestOptions";
import { Capacitor } from "@capacitor/core";
import { customFetch } from "./customFetch";

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;

export type OpenAPIConfig = {
  BASE: string;
  VERSION: string;
  WITH_CREDENTIALS: boolean;
  CREDENTIALS: "include" | "omit" | "same-origin";
  TOKEN?: string | Resolver<string> | undefined;
  USERNAME?: string | Resolver<string> | undefined;
  PASSWORD?: string | Resolver<string> | undefined;
  HEADERS?: Headers | Resolver<Headers> | undefined;
  ENCODE_PATH?: ((path: string) => string) | undefined;
};

const isMobile = Capacitor.isNativePlatform();
let apiBaseUrl: string;

if (import.meta.env.VITE_USE_STAGING === "true") {
  apiBaseUrl = import.meta.env.VITE_SERVER_STAGING_URL || "";
} else if (isMobile) {
  apiBaseUrl = import.meta.env.VITE_SERVER_PROD_URL || "";
} else {
  apiBaseUrl = import.meta.env.VITE_SERVER_LOCAL_URL || "";
}

// alert("Usando API base: " + apiBaseUrl);

export const OpenAPI: OpenAPIConfig = {
  BASE: apiBaseUrl,
  VERSION: "0.0.0",
  WITH_CREDENTIALS: true,
  CREDENTIALS: "include",
  TOKEN: async () => {
    const token = localStorage.getItem("accessToken");
    return `${token || ""}`;
  },
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
  fetch: customFetch,
};
