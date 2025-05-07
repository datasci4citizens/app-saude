/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Concept } from '../models/Concept';
import type { PatchedConcept } from '../models/PatchedConcept';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ConceptService {
    /**
     * @returns Concept
     * @throws ApiError
     */
    public static apiConceptList(): CancelablePromise<Array<Concept>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/concept/',
        });
    }
    /**
     * @param requestBody
     * @returns Concept
     * @throws ApiError
     */
    public static apiConceptCreate(
        requestBody?: Concept,
    ): CancelablePromise<Concept> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/concept/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param conceptId A unique integer value identifying this concept.
     * @returns Concept
     * @throws ApiError
     */
    public static apiConceptRetrieve(
        conceptId: number,
    ): CancelablePromise<Concept> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/concept/{concept_id}/',
            path: {
                'concept_id': conceptId,
            },
        });
    }
    /**
     * @param conceptId A unique integer value identifying this concept.
     * @param requestBody
     * @returns Concept
     * @throws ApiError
     */
    public static apiConceptUpdate(
        conceptId: number,
        requestBody?: Concept,
    ): CancelablePromise<Concept> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/concept/{concept_id}/',
            path: {
                'concept_id': conceptId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param conceptId A unique integer value identifying this concept.
     * @param requestBody
     * @returns Concept
     * @throws ApiError
     */
    public static apiConceptPartialUpdate(
        conceptId: number,
        requestBody?: PatchedConcept,
    ): CancelablePromise<Concept> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/concept/{concept_id}/',
            path: {
                'concept_id': conceptId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param conceptId A unique integer value identifying this concept.
     * @returns void
     * @throws ApiError
     */
    public static apiConceptDestroy(
        conceptId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/concept/{concept_id}/',
            path: {
                'concept_id': conceptId,
            },
        });
    }
}
