/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FullPerson } from '../models/FullPerson';
import type { FullPersonCreate } from '../models/FullPersonCreate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FullPersonService {
    /**
     * @param requestBody
     * @returns FullPerson
     * @throws ApiError
     */
    public static apiFullPersonCreate(
        requestBody: FullPersonCreate,
    ): CancelablePromise<FullPerson> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/full-person/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
