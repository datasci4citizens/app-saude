/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedPerson } from '../models/PatchedPerson';
import type { Person } from '../models/Person';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PersonService {
    /**
     * @returns Person
     * @throws ApiError
     */
    public static apiPersonList(): CancelablePromise<Array<Person>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/person/',
        });
    }
    /**
     * @param requestBody
     * @returns Person
     * @throws ApiError
     */
    public static apiPersonCreate(
        requestBody?: Person,
    ): CancelablePromise<Person> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/person/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param personId A unique integer value identifying this person.
     * @returns Person
     * @throws ApiError
     */
    public static apiPersonRetrieve(
        personId: number,
    ): CancelablePromise<Person> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/person/{person_id}/',
            path: {
                'person_id': personId,
            },
        });
    }
    /**
     * @param personId A unique integer value identifying this person.
     * @param requestBody
     * @returns Person
     * @throws ApiError
     */
    public static apiPersonUpdate(
        personId: number,
        requestBody?: Person,
    ): CancelablePromise<Person> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/person/{person_id}/',
            path: {
                'person_id': personId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param personId A unique integer value identifying this person.
     * @param requestBody
     * @returns Person
     * @throws ApiError
     */
    public static apiPersonPartialUpdate(
        personId: number,
        requestBody?: PatchedPerson,
    ): CancelablePromise<Person> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/person/{person_id}/',
            path: {
                'person_id': personId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param personId A unique integer value identifying this person.
     * @returns void
     * @throws ApiError
     */
    public static apiPersonDestroy(
        personId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/person/{person_id}/',
            path: {
                'person_id': personId,
            },
        });
    }
}
