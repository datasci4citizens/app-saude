/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConceptClass } from '../models/ConceptClass';
import type { PatchedConceptClass } from '../models/PatchedConceptClass';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ConceptClassService {
    /**
     * @returns ConceptClass
     * @throws ApiError
     */
    public static apiConceptClassList(): CancelablePromise<Array<ConceptClass>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/concept-class/',
        });
    }
    /**
     * @param requestBody
     * @returns ConceptClass
     * @throws ApiError
     */
    public static apiConceptClassCreate(
        requestBody?: ConceptClass,
    ): CancelablePromise<ConceptClass> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/concept-class/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param conceptClassId A unique value identifying this concept class.
     * @returns ConceptClass
     * @throws ApiError
     */
    public static apiConceptClassRetrieve(
        conceptClassId: string,
    ): CancelablePromise<ConceptClass> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/concept-class/{concept_class_id}/',
            path: {
                'concept_class_id': conceptClassId,
            },
        });
    }
    /**
     * @param conceptClassId A unique value identifying this concept class.
     * @param requestBody
     * @returns ConceptClass
     * @throws ApiError
     */
    public static apiConceptClassUpdate(
        conceptClassId: string,
        requestBody?: ConceptClass,
    ): CancelablePromise<ConceptClass> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/concept-class/{concept_class_id}/',
            path: {
                'concept_class_id': conceptClassId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param conceptClassId A unique value identifying this concept class.
     * @param requestBody
     * @returns ConceptClass
     * @throws ApiError
     */
    public static apiConceptClassPartialUpdate(
        conceptClassId: string,
        requestBody?: PatchedConceptClass,
    ): CancelablePromise<ConceptClass> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/concept-class/{concept_class_id}/',
            path: {
                'concept_class_id': conceptClassId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param conceptClassId A unique value identifying this concept class.
     * @returns void
     * @throws ApiError
     */
    public static apiConceptClassDestroy(
        conceptClassId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/concept-class/{concept_class_id}/',
            path: {
                'concept_class_id': conceptClassId,
            },
        });
    }
}
