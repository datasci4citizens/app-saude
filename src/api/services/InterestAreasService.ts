/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterestArea } from '../models/InterestArea';
import type { PatchedInterestAreaBulkUpdate } from '../models/PatchedInterestAreaBulkUpdate';
import type { PatchedMarkAttentionPoint } from '../models/PatchedMarkAttentionPoint';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InterestAreasService {
    /**
     * Get interest areas for the authenticated user
     * Retrieve the interest areas for the authenticated user. Optionally, can return crowd-sourced interest areas.
     * @param crowdSource If true, returns interest areas that are crowd-sourced (not linked to a specific person).
     * @returns InterestArea
     * @throws ApiError
     */
    public static personInterestAreasList(
        crowdSource?: boolean,
    ): CancelablePromise<Array<InterestArea>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/person/interest-areas/',
            query: {
                'crowd_source': crowdSource,
            },
        });
    }
    /**
     * @param requestBody
     * @returns InterestArea
     * @throws ApiError
     */
    public static personInterestAreasCreate(
        requestBody?: InterestArea,
    ): CancelablePromise<InterestArea> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/person/interest-areas/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static personInterestAreasPartialUpdate(
        requestBody?: PatchedInterestAreaBulkUpdate,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/person/interest-areas/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param interestAreaId
     * @returns InterestArea
     * @throws ApiError
     */
    public static personInterestAreasRetrieve(
        interestAreaId: number,
    ): CancelablePromise<InterestArea> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/person/interest-areas/{interest_area_id}/',
            path: {
                'interest_area_id': interestAreaId,
            },
        });
    }
    /**
     * @param interestAreaId
     * @returns void
     * @throws ApiError
     */
    public static personInterestAreasDestroy(
        interestAreaId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/person/interest-areas/{interest_area_id}/',
            path: {
                'interest_area_id': interestAreaId,
            },
        });
    }
    /**
     * Marcar área como ponto de atenção
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static markObservationAsAttentionPoint(
        requestBody?: PatchedMarkAttentionPoint,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/person/interest-areas/mark-attention-point/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
