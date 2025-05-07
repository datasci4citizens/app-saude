/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedProvider } from '../models/PatchedProvider';
import type { Provider } from '../models/Provider';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProviderService {
    /**
     * @returns Provider
     * @throws ApiError
     */
    public static apiProviderList(): CancelablePromise<Array<Provider>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/provider/',
        });
    }
    /**
     * @param requestBody
     * @returns Provider
     * @throws ApiError
     */
    public static apiProviderCreate(
        requestBody?: Provider,
    ): CancelablePromise<Provider> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/provider/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param providerId A unique integer value identifying this provider.
     * @returns Provider
     * @throws ApiError
     */
    public static apiProviderRetrieve(
        providerId: number,
    ): CancelablePromise<Provider> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/provider/{provider_id}/',
            path: {
                'provider_id': providerId,
            },
        });
    }
    /**
     * @param providerId A unique integer value identifying this provider.
     * @param requestBody
     * @returns Provider
     * @throws ApiError
     */
    public static apiProviderUpdate(
        providerId: number,
        requestBody?: Provider,
    ): CancelablePromise<Provider> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/provider/{provider_id}/',
            path: {
                'provider_id': providerId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param providerId A unique integer value identifying this provider.
     * @param requestBody
     * @returns Provider
     * @throws ApiError
     */
    public static apiProviderPartialUpdate(
        providerId: number,
        requestBody?: PatchedProvider,
    ): CancelablePromise<Provider> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/provider/{provider_id}/',
            path: {
                'provider_id': providerId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param providerId A unique integer value identifying this provider.
     * @returns void
     * @throws ApiError
     */
    public static apiProviderDestroy(
        providerId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/provider/{provider_id}/',
            path: {
                'provider_id': providerId,
            },
        });
    }
}
