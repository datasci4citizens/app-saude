/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FactRelationship } from '../models/FactRelationship';
import type { PatchedFactRelationship } from '../models/PatchedFactRelationship';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FactRelationshipService {
    /**
     * @returns FactRelationship
     * @throws ApiError
     */
    public static apiFactRelationshipList(): CancelablePromise<Array<FactRelationship>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fact-relationship/',
        });
    }
    /**
     * @param requestBody
     * @returns FactRelationship
     * @throws ApiError
     */
    public static apiFactRelationshipCreate(
        requestBody: FactRelationship,
    ): CancelablePromise<FactRelationship> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/fact-relationship/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this fact relationship.
     * @returns FactRelationship
     * @throws ApiError
     */
    public static apiFactRelationshipRetrieve(
        id: number,
    ): CancelablePromise<FactRelationship> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fact-relationship/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this fact relationship.
     * @param requestBody
     * @returns FactRelationship
     * @throws ApiError
     */
    public static apiFactRelationshipUpdate(
        id: number,
        requestBody: FactRelationship,
    ): CancelablePromise<FactRelationship> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/fact-relationship/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this fact relationship.
     * @param requestBody
     * @returns FactRelationship
     * @throws ApiError
     */
    public static apiFactRelationshipPartialUpdate(
        id: number,
        requestBody?: PatchedFactRelationship,
    ): CancelablePromise<FactRelationship> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/fact-relationship/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this fact relationship.
     * @returns void
     * @throws ApiError
     */
    public static apiFactRelationshipDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/fact-relationship/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
