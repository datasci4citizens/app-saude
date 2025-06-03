/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LocationCreate } from '../models/LocationCreate';
import type { LocationRetrieve } from '../models/LocationRetrieve';
import type { LocationUpdate } from '../models/LocationUpdate';
import type { PatchedLocationUpdate } from '../models/PatchedLocationUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LocationService {
    /**
     * @returns LocationRetrieve
     * @throws ApiError
     */
    public static apiLocationList(): CancelablePromise<Array<LocationRetrieve>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/location/',
        });
    }
    /**
     * @param requestBody
     * @returns LocationCreate
     * @throws ApiError
     */
    public static apiLocationCreate(
        requestBody?: LocationCreate,
    ): CancelablePromise<LocationCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/location/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param locationId A unique integer value identifying this location.
     * @returns LocationRetrieve
     * @throws ApiError
     */
    public static apiLocationRetrieve(
        locationId: number,
    ): CancelablePromise<LocationRetrieve> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/location/{location_id}/',
            path: {
                'location_id': locationId,
            },
        });
    }
    /**
     * @param locationId A unique integer value identifying this location.
     * @param requestBody
     * @returns LocationUpdate
     * @throws ApiError
     */
    public static apiLocationUpdate(
        locationId: number,
        requestBody?: LocationUpdate,
    ): CancelablePromise<LocationUpdate> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/location/{location_id}/',
            path: {
                'location_id': locationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param locationId A unique integer value identifying this location.
     * @param requestBody
     * @returns LocationUpdate
     * @throws ApiError
     */
    public static apiLocationPartialUpdate(
        locationId: number,
        requestBody?: PatchedLocationUpdate,
    ): CancelablePromise<LocationUpdate> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/location/{location_id}/',
            path: {
                'location_id': locationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param locationId A unique integer value identifying this location.
     * @returns void
     * @throws ApiError
     */
    public static apiLocationDestroy(
        locationId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/location/{location_id}/',
            path: {
                'location_id': locationId,
            },
        });
    }
}
