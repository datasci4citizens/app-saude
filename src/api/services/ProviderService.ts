/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedProviderUpdate } from '../models/PatchedProviderUpdate';
import type { ProviderCreate } from '../models/ProviderCreate';
import type { ProviderRetrieve } from '../models/ProviderRetrieve';
import type { ProviderUpdate } from '../models/ProviderUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProviderService {
    /**
     * @returns ProviderRetrieve
     * @throws ApiError
     */
    public static apiProviderList(): CancelablePromise<Array<ProviderRetrieve>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/provider/',
        });
    }
    /**
     * @param requestBody
     * @returns ProviderCreate
     * @throws ApiError
     */
    public static apiProviderCreate(
        requestBody?: ProviderCreate,
    ): CancelablePromise<ProviderCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/provider/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param providerId A unique integer value identifying this provider.
     * @returns ProviderRetrieve
     * @throws ApiError
     */
    public static apiProviderRetrieve(
        providerId: number,
    ): CancelablePromise<ProviderRetrieve> {
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
     * @returns ProviderUpdate
     * @throws ApiError
     */
    public static apiProviderUpdate(
        providerId: number,
        requestBody?: ProviderUpdate,
    ): CancelablePromise<ProviderUpdate> {
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
     * @returns ProviderUpdate
     * @throws ApiError
     */
    public static apiProviderPartialUpdate(
        providerId: number,
        requestBody?: PatchedProviderUpdate,
    ): CancelablePromise<ProviderUpdate> {
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
