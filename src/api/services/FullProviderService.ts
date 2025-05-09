/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FullProviderCreate } from '../models/FullProviderCreate';
import type { FullProviderRetrieve } from '../models/FullProviderRetrieve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FullProviderService {
    /**
     * @param requestBody
     * @returns FullProviderRetrieve
     * @throws ApiError
     */
    public static apiFullProviderCreate(
        requestBody: FullProviderCreate,
    ): CancelablePromise<FullProviderRetrieve> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/full-provider/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
