/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConceptCreate } from '../models/ConceptCreate';
import type { ConceptRetrieve } from '../models/ConceptRetrieve';
import type { ConceptUpdate } from '../models/ConceptUpdate';
import type { PatchedConceptUpdate } from '../models/PatchedConceptUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ConceptService {
    /**
     * @param _class Lista de concept_class_id (ex: class=Gender,Ethnicity)
     * @param lang Idioma da tradução (ex: pt)
     * @returns ConceptRetrieve
     * @throws ApiError
     */
    public static apiConceptList(
        _class?: string,
        lang?: string,
    ): CancelablePromise<Array<ConceptRetrieve>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/concept/',
            query: {
                'class': _class,
                'lang': lang,
            },
        });
    }
    /**
     * @param _class Lista de concept_class_id (ex: class=Gender,Ethnicity)
     * @param lang Idioma da tradução (ex: pt)
     * @param requestBody
     * @returns ConceptCreate
     * @throws ApiError
     */
    public static apiConceptCreate(
        _class?: string,
        lang?: string,
        requestBody?: ConceptCreate,
    ): CancelablePromise<ConceptCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/concept/',
            query: {
                'class': _class,
                'lang': lang,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param conceptId A unique integer value identifying this concept.
     * @param _class Lista de concept_class_id (ex: class=Gender,Ethnicity)
     * @param lang Idioma da tradução (ex: pt)
     * @returns ConceptRetrieve
     * @throws ApiError
     */
    public static apiConceptRetrieve(
        conceptId: number,
        _class?: string,
        lang?: string,
    ): CancelablePromise<ConceptRetrieve> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/concept/{concept_id}/',
            path: {
                'concept_id': conceptId,
            },
            query: {
                'class': _class,
                'lang': lang,
            },
        });
    }
    /**
     * @param conceptId A unique integer value identifying this concept.
     * @param _class Lista de concept_class_id (ex: class=Gender,Ethnicity)
     * @param lang Idioma da tradução (ex: pt)
     * @param requestBody
     * @returns ConceptUpdate
     * @throws ApiError
     */
    public static apiConceptUpdate(
        conceptId: number,
        _class?: string,
        lang?: string,
        requestBody?: ConceptUpdate,
    ): CancelablePromise<ConceptUpdate> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/concept/{concept_id}/',
            path: {
                'concept_id': conceptId,
            },
            query: {
                'class': _class,
                'lang': lang,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param conceptId A unique integer value identifying this concept.
     * @param _class Lista de concept_class_id (ex: class=Gender,Ethnicity)
     * @param lang Idioma da tradução (ex: pt)
     * @param requestBody
     * @returns ConceptUpdate
     * @throws ApiError
     */
    public static apiConceptPartialUpdate(
        conceptId: number,
        _class?: string,
        lang?: string,
        requestBody?: PatchedConceptUpdate,
    ): CancelablePromise<ConceptUpdate> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/concept/{concept_id}/',
            path: {
                'concept_id': conceptId,
            },
            query: {
                'class': _class,
                'lang': lang,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param conceptId A unique integer value identifying this concept.
     * @param _class Lista de concept_class_id (ex: class=Gender,Ethnicity)
     * @param lang Idioma da tradução (ex: pt)
     * @returns void
     * @throws ApiError
     */
    public static apiConceptDestroy(
        conceptId: number,
        _class?: string,
        lang?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/concept/{concept_id}/',
            path: {
                'concept_id': conceptId,
            },
            query: {
                'class': _class,
                'lang': lang,
            },
        });
    }
}
