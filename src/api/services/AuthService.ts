/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminLogin } from '../models/AdminLogin';
import type { Auth } from '../models/Auth';
import type { AuthTokenResponse } from '../models/AuthTokenResponse';
import type { TokenRefresh } from '../models/TokenRefresh';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * @param requestBody
     * @returns any No response body
     * @throws ApiError
     */
    public static authLoginAdminCreate(
        requestBody: AdminLogin,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login/admin/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns AuthTokenResponse
     * @throws ApiError
     */
    public static authLoginGoogleCreate(
        requestBody?: Auth,
    ): CancelablePromise<AuthTokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login/google/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Takes a refresh type JSON web token and returns an access type JSON web
     * token if the refresh token is valid.
     * @param requestBody
     * @returns TokenRefresh
     * @throws ApiError
     */
    public static authTokenRefreshCreate(
        requestBody: TokenRefresh,
    ): CancelablePromise<TokenRefresh> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/token/refresh/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
