/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CareSite } from '../models/CareSite';
import type { PatchedCareSite } from '../models/PatchedCareSite';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CareSiteService {
    /**
     * @returns CareSite
     * @throws ApiError
     */
    public static apiCareSiteList(): CancelablePromise<Array<CareSite>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/care-site/',
        });
    }
    /**
     * @param requestBody
     * @returns CareSite
     * @throws ApiError
     */
    public static apiCareSiteCreate(
        requestBody?: CareSite,
    ): CancelablePromise<CareSite> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/care-site/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param careSiteId A unique integer value identifying this care site.
     * @returns CareSite
     * @throws ApiError
     */
    public static apiCareSiteRetrieve(
        careSiteId: number,
    ): CancelablePromise<CareSite> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/care-site/{care_site_id}/',
            path: {
                'care_site_id': careSiteId,
            },
        });
    }
    /**
     * @param careSiteId A unique integer value identifying this care site.
     * @param requestBody
     * @returns CareSite
     * @throws ApiError
     */
    public static apiCareSiteUpdate(
        careSiteId: number,
        requestBody?: CareSite,
    ): CancelablePromise<CareSite> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/care-site/{care_site_id}/',
            path: {
                'care_site_id': careSiteId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param careSiteId A unique integer value identifying this care site.
     * @param requestBody
     * @returns CareSite
     * @throws ApiError
     */
    public static apiCareSitePartialUpdate(
        careSiteId: number,
        requestBody?: PatchedCareSite,
    ): CancelablePromise<CareSite> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/care-site/{care_site_id}/',
            path: {
                'care_site_id': careSiteId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param careSiteId A unique integer value identifying this care site.
     * @returns void
     * @throws ApiError
     */
    public static apiCareSiteDestroy(
        careSiteId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/care-site/{care_site_id}/',
            path: {
                'care_site_id': careSiteId,
            },
        });
    }
}
