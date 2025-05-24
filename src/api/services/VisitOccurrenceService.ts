/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedVisitOccurrenceUpdate } from '../models/PatchedVisitOccurrenceUpdate';
import type { VisitOccurrenceCreate } from '../models/VisitOccurrenceCreate';
import type { VisitOccurrenceRetrieve } from '../models/VisitOccurrenceRetrieve';
import type { VisitOccurrenceUpdate } from '../models/VisitOccurrenceUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VisitOccurrenceService {
    /**
     * @returns VisitOccurrenceRetrieve
     * @throws ApiError
     */
    public static apiVisitOccurrenceList(): CancelablePromise<Array<VisitOccurrenceRetrieve>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/visit-occurrence/',
        });
    }
    /**
     * @param requestBody
     * @returns VisitOccurrenceCreate
     * @throws ApiError
     */
    public static apiVisitOccurrenceCreate(
        requestBody?: VisitOccurrenceCreate,
    ): CancelablePromise<VisitOccurrenceCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/visit-occurrence/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param visitOccurrenceId A unique integer value identifying this visit occurrence.
     * @returns VisitOccurrenceRetrieve
     * @throws ApiError
     */
    public static apiVisitOccurrenceRetrieve(
        visitOccurrenceId: number,
    ): CancelablePromise<VisitOccurrenceRetrieve> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/visit-occurrence/{visit_occurrence_id}/',
            path: {
                'visit_occurrence_id': visitOccurrenceId,
            },
        });
    }
    /**
     * @param visitOccurrenceId A unique integer value identifying this visit occurrence.
     * @param requestBody
     * @returns VisitOccurrenceUpdate
     * @throws ApiError
     */
    public static apiVisitOccurrenceUpdate(
        visitOccurrenceId: number,
        requestBody?: VisitOccurrenceUpdate,
    ): CancelablePromise<VisitOccurrenceUpdate> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/visit-occurrence/{visit_occurrence_id}/',
            path: {
                'visit_occurrence_id': visitOccurrenceId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param visitOccurrenceId A unique integer value identifying this visit occurrence.
     * @param requestBody
     * @returns VisitOccurrenceUpdate
     * @throws ApiError
     */
    public static apiVisitOccurrencePartialUpdate(
        visitOccurrenceId: number,
        requestBody?: PatchedVisitOccurrenceUpdate,
    ): CancelablePromise<VisitOccurrenceUpdate> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/visit-occurrence/{visit_occurrence_id}/',
            path: {
                'visit_occurrence_id': visitOccurrenceId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param visitOccurrenceId A unique integer value identifying this visit occurrence.
     * @returns void
     * @throws ApiError
     */
    public static apiVisitOccurrenceDestroy(
        visitOccurrenceId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/visit-occurrence/{visit_occurrence_id}/',
            path: {
                'visit_occurrence_id': visitOccurrenceId,
            },
        });
    }
}
