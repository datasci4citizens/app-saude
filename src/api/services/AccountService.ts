/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountService {
    /**
     * ViewSet to manage user accounts.
     * Allowed HTTP methods: GET, DELETE.
     * @returns any No response body
     * @throws ApiError
     */
    public static accountsRetrieve(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/accounts/',
        });
    }
    /**
     * ViewSet to manage user accounts.
     * Allowed HTTP methods: GET, DELETE.
     * @returns void
     * @throws ApiError
     */
    public static accountsDestroy(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/accounts/',
        });
    }
}
