/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConceptSynonym } from '../models/ConceptSynonym';
import type { PatchedConceptSynonym } from '../models/PatchedConceptSynonym';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ConceptSynonymService {
    /**
     * @returns ConceptSynonym
     * @throws ApiError
     */
    public static apiConceptSynonymList(): CancelablePromise<Array<ConceptSynonym>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/concept-synonym/',
        });
    }
    /**
     * @param requestBody
     * @returns ConceptSynonym
     * @throws ApiError
     */
    public static apiConceptSynonymCreate(
        requestBody: ConceptSynonym,
    ): CancelablePromise<ConceptSynonym> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/concept-synonym/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this concept synonym.
     * @returns ConceptSynonym
     * @throws ApiError
     */
    public static apiConceptSynonymRetrieve(
        id: number,
    ): CancelablePromise<ConceptSynonym> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/concept-synonym/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this concept synonym.
     * @param requestBody
     * @returns ConceptSynonym
     * @throws ApiError
     */
    public static apiConceptSynonymUpdate(
        id: number,
        requestBody: ConceptSynonym,
    ): CancelablePromise<ConceptSynonym> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/concept-synonym/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this concept synonym.
     * @param requestBody
     * @returns ConceptSynonym
     * @throws ApiError
     */
    public static apiConceptSynonymPartialUpdate(
        id: number,
        requestBody?: PatchedConceptSynonym,
    ): CancelablePromise<ConceptSynonym> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/concept-synonym/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this concept synonym.
     * @returns void
     * @throws ApiError
     */
    public static apiConceptSynonymDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/concept-synonym/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
