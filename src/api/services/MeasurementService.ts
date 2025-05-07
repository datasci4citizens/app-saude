/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Measurement } from '../models/Measurement';
import type { PatchedMeasurement } from '../models/PatchedMeasurement';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MeasurementService {
    /**
     * @returns Measurement
     * @throws ApiError
     */
    public static apiMeasurementList(): CancelablePromise<Array<Measurement>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/measurement/',
        });
    }
    /**
     * @param requestBody
     * @returns Measurement
     * @throws ApiError
     */
    public static apiMeasurementCreate(
        requestBody?: Measurement,
    ): CancelablePromise<Measurement> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/measurement/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param measurementId A unique integer value identifying this measurement.
     * @returns Measurement
     * @throws ApiError
     */
    public static apiMeasurementRetrieve(
        measurementId: number,
    ): CancelablePromise<Measurement> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/measurement/{measurement_id}/',
            path: {
                'measurement_id': measurementId,
            },
        });
    }
    /**
     * @param measurementId A unique integer value identifying this measurement.
     * @param requestBody
     * @returns Measurement
     * @throws ApiError
     */
    public static apiMeasurementUpdate(
        measurementId: number,
        requestBody?: Measurement,
    ): CancelablePromise<Measurement> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/measurement/{measurement_id}/',
            path: {
                'measurement_id': measurementId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param measurementId A unique integer value identifying this measurement.
     * @param requestBody
     * @returns Measurement
     * @throws ApiError
     */
    public static apiMeasurementPartialUpdate(
        measurementId: number,
        requestBody?: PatchedMeasurement,
    ): CancelablePromise<Measurement> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/measurement/{measurement_id}/',
            path: {
                'measurement_id': measurementId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param measurementId A unique integer value identifying this measurement.
     * @returns void
     * @throws ApiError
     */
    public static apiMeasurementDestroy(
        measurementId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/measurement/{measurement_id}/',
            path: {
                'measurement_id': measurementId,
            },
        });
    }
}
