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
     * @param _class Lista de concept_class_id (ex: class=Gender,Ethnicity)
     * @param lang Idioma da tradução (ex: pt)
     * @returns Concept
     * @throws ApiError
     */
    public static apiConceptList(
        _class?: string,
        lang?: string,
    ): CancelablePromise<Array<Concept>> {
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
     * @returns Concept
     * @throws ApiError
     */
    public static apiConceptCreate(
        _class?: string,
        lang?: string,
        requestBody?: Concept,
    ): CancelablePromise<Concept> {
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
     * @returns Concept
     * @throws ApiError
     */
    public static apiConceptRetrieve(
        conceptId: number,
        _class?: string,
        lang?: string,
    ): CancelablePromise<Concept> {
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
     * @returns Concept
     * @throws ApiError
     */
    public static apiConceptUpdate(
        conceptId: number,
        _class?: string,
        lang?: string,
        requestBody?: Concept,
    ): CancelablePromise<Concept> {
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
     * @returns Concept
     * @throws ApiError
     */
    public static apiConceptPartialUpdate(
        conceptId: number,
        _class?: string,
        lang?: string,
        requestBody?: PatchedConcept,
    ): CancelablePromise<Concept> {
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
