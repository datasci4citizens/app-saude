/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FullPersonCreate } from '../models/FullPersonCreate';
import type { FullPersonRetrieve } from '../models/FullPersonRetrieve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FullPersonService {
    /**
     * @param requestBody
     * @returns FullPersonRetrieve
     * @throws ApiError
     */
    public static apiFullPersonCreate(
        requestBody: FullPersonCreate,
    ): CancelablePromise<FullPersonRetrieve> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/full-person/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
