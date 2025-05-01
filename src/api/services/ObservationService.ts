/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Observation } from '../models/Observation';
import type { PatchedObservation } from '../models/PatchedObservation';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ObservationService {
    /**
     * @returns Observation
     * @throws ApiError
     */
    public static apiObservationList(): CancelablePromise<Array<Observation>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/observation/',
        });
    }
    /**
     * @param requestBody
     * @returns Observation
     * @throws ApiError
     */
    public static apiObservationCreate(
        requestBody?: Observation,
    ): CancelablePromise<Observation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/observation/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param observationId A unique integer value identifying this observation.
     * @returns Observation
     * @throws ApiError
     */
    public static apiObservationRetrieve(
        observationId: number,
    ): CancelablePromise<Observation> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/observation/{observation_id}/',
            path: {
                'observation_id': observationId,
            },
        });
    }
    /**
     * @param observationId A unique integer value identifying this observation.
     * @param requestBody
     * @returns Observation
     * @throws ApiError
     */
    public static apiObservationUpdate(
        observationId: number,
        requestBody?: Observation,
    ): CancelablePromise<Observation> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/observation/{observation_id}/',
            path: {
                'observation_id': observationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param observationId A unique integer value identifying this observation.
     * @param requestBody
     * @returns Observation
     * @throws ApiError
     */
    public static apiObservationPartialUpdate(
        observationId: number,
        requestBody?: PatchedObservation,
    ): CancelablePromise<Observation> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/observation/{observation_id}/',
            path: {
                'observation_id': observationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param observationId A unique integer value identifying this observation.
     * @returns void
     * @throws ApiError
     */
    public static apiObservationDestroy(
        observationId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/observation/{observation_id}/',
            path: {
                'observation_id': observationId,
            },
        });
    }
}
