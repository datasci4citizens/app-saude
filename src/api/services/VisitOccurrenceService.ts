/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedVisitOccurrence } from '../models/PatchedVisitOccurrence';
import type { VisitOccurrence } from '../models/VisitOccurrence';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VisitOccurrenceService {
    /**
     * @returns VisitOccurrence
     * @throws ApiError
     */
    public static apiVisitOccurrenceList(): CancelablePromise<Array<VisitOccurrence>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/visit-occurrence/',
        });
    }
    /**
     * @param requestBody
     * @returns VisitOccurrence
     * @throws ApiError
     */
    public static apiVisitOccurrenceCreate(
        requestBody?: VisitOccurrence,
    ): CancelablePromise<VisitOccurrence> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/visit-occurrence/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param visitOccurrenceId A unique integer value identifying this visit occurrence.
     * @returns VisitOccurrence
     * @throws ApiError
     */
    public static apiVisitOccurrenceRetrieve(
        visitOccurrenceId: number,
    ): CancelablePromise<VisitOccurrence> {
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
     * @returns VisitOccurrence
     * @throws ApiError
     */
    public static apiVisitOccurrenceUpdate(
        visitOccurrenceId: number,
        requestBody?: VisitOccurrence,
    ): CancelablePromise<VisitOccurrence> {
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
     * @returns VisitOccurrence
     * @throws ApiError
     */
    public static apiVisitOccurrencePartialUpdate(
        visitOccurrenceId: number,
        requestBody?: PatchedVisitOccurrence,
    ): CancelablePromise<VisitOccurrence> {
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
