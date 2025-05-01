/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Auth } from '../models/Auth';
import type { AuthTokenResponse } from '../models/AuthTokenResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * @returns any No response body
     * @throws ApiError
     */
    public static authLoginAdminCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login/admin/',
        });
    }
    /**
     * @param requestBody
     * @returns AuthTokenResponse
     * @throws ApiError
     */
    public static authLoginGoogleCreate(
        requestBody: Auth,
    ): CancelablePromise<AuthTokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login/google/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any No response body
     * @throws ApiError
     */
    public static authMeRetrieve(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me/',
        });
    }
}
