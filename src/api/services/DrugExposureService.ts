/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DrugExposure } from '../models/DrugExposure';
import type { PatchedDrugExposure } from '../models/PatchedDrugExposure';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DrugExposureService {
    /**
     * @returns DrugExposure
     * @throws ApiError
     */
    public static apiDrugExposureList(): CancelablePromise<Array<DrugExposure>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/drug-exposure/',
        });
    }
    /**
     * @param requestBody
     * @returns DrugExposure
     * @throws ApiError
     */
    public static apiDrugExposureCreate(
        requestBody?: DrugExposure,
    ): CancelablePromise<DrugExposure> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/drug-exposure/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param drugExposureId A unique integer value identifying this drug exposure.
     * @returns DrugExposure
     * @throws ApiError
     */
    public static apiDrugExposureRetrieve(
        drugExposureId: number,
    ): CancelablePromise<DrugExposure> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/drug-exposure/{drug_exposure_id}/',
            path: {
                'drug_exposure_id': drugExposureId,
            },
        });
    }
    /**
     * @param drugExposureId A unique integer value identifying this drug exposure.
     * @param requestBody
     * @returns DrugExposure
     * @throws ApiError
     */
    public static apiDrugExposureUpdate(
        drugExposureId: number,
        requestBody?: DrugExposure,
    ): CancelablePromise<DrugExposure> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/drug-exposure/{drug_exposure_id}/',
            path: {
                'drug_exposure_id': drugExposureId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param drugExposureId A unique integer value identifying this drug exposure.
     * @param requestBody
     * @returns DrugExposure
     * @throws ApiError
     */
    public static apiDrugExposurePartialUpdate(
        drugExposureId: number,
        requestBody?: PatchedDrugExposure,
    ): CancelablePromise<DrugExposure> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/drug-exposure/{drug_exposure_id}/',
            path: {
                'drug_exposure_id': drugExposureId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param drugExposureId A unique integer value identifying this drug exposure.
     * @returns void
     * @throws ApiError
     */
    public static apiDrugExposureDestroy(
        drugExposureId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/drug-exposure/{drug_exposure_id}/',
            path: {
                'drug_exposure_id': drugExposureId,
            },
        });
    }
}
