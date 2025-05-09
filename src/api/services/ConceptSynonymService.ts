/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConceptSynonymCreate } from '../models/ConceptSynonymCreate';
import type { ConceptSynonymRetrieve } from '../models/ConceptSynonymRetrieve';
import type { ConceptSynonymUpdate } from '../models/ConceptSynonymUpdate';
import type { PatchedConceptSynonymUpdate } from '../models/PatchedConceptSynonymUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ConceptSynonymService {
    /**
     * @returns ConceptSynonymRetrieve
     * @throws ApiError
     */
    public static apiConceptSynonymList(): CancelablePromise<Array<ConceptSynonymRetrieve>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/concept-synonym/',
        });
    }
    /**
     * @param requestBody
     * @returns ConceptSynonymCreate
     * @throws ApiError
     */
    public static apiConceptSynonymCreate(
        requestBody: ConceptSynonymCreate,
    ): CancelablePromise<ConceptSynonymCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/concept-synonym/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this concept synonym.
     * @returns ConceptSynonymRetrieve
     * @throws ApiError
     */
    public static apiConceptSynonymRetrieve(
        id: number,
    ): CancelablePromise<ConceptSynonymRetrieve> {
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
     * @returns ConceptSynonymUpdate
     * @throws ApiError
     */
    public static apiConceptSynonymUpdate(
        id: number,
        requestBody: ConceptSynonymUpdate,
    ): CancelablePromise<ConceptSynonymUpdate> {
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
     * @returns ConceptSynonymUpdate
     * @throws ApiError
     */
    public static apiConceptSynonymPartialUpdate(
        id: number,
        requestBody?: PatchedConceptSynonymUpdate,
    ): CancelablePromise<ConceptSynonymUpdate> {
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
