/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedPersonUpdate } from '../models/PatchedPersonUpdate';
import type { PersonCreate } from '../models/PersonCreate';
import type { PersonRetrieve } from '../models/PersonRetrieve';
import type { PersonUpdate } from '../models/PersonUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PersonService {
    /**
     * @param birthDatetime
     * @param createdAt
     * @param ethnicityConcept
     * @param genderConcept
     * @param location
     * @param ordering Which field to use when ordering the results.
     * @param profilePicture
     * @param raceConcept
     * @param search A search term.
     * @param socialName
     * @param updatedAt
     * @param user
     * @param yearOfBirth
     * @returns PersonRetrieve
     * @throws ApiError
     */
    public static apiPersonList(
        birthDatetime?: string,
        createdAt?: string,
        ethnicityConcept?: number,
        genderConcept?: number,
        location?: number,
        ordering?: string,
        profilePicture?: string,
        raceConcept?: number,
        search?: string,
        socialName?: string,
        updatedAt?: string,
        user?: number,
        yearOfBirth?: number,
    ): CancelablePromise<Array<PersonRetrieve>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/person/',
            query: {
                'birth_datetime': birthDatetime,
                'created_at': createdAt,
                'ethnicity_concept': ethnicityConcept,
                'gender_concept': genderConcept,
                'location': location,
                'ordering': ordering,
                'profile_picture': profilePicture,
                'race_concept': raceConcept,
                'search': search,
                'social_name': socialName,
                'updated_at': updatedAt,
                'user': user,
                'year_of_birth': yearOfBirth,
            },
        });
    }
    /**
     * @param requestBody
     * @returns PersonRetrieve
     * @throws ApiError
     */
    public static apiPersonCreate(
        requestBody?: PersonCreate,
    ): CancelablePromise<PersonRetrieve> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/person/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param personId A unique integer value identifying this person.
     * @returns PersonRetrieve
     * @throws ApiError
     */
    public static apiPersonRetrieve(
        personId: number,
    ): CancelablePromise<PersonRetrieve> {
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
     * @returns PersonUpdate
     * @throws ApiError
     */
    public static apiPersonUpdate(
        personId: number,
        requestBody?: PersonUpdate,
    ): CancelablePromise<PersonUpdate> {
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
     * @returns PersonUpdate
     * @throws ApiError
     */
    public static apiPersonPartialUpdate(
        personId: number,
        requestBody?: PatchedPersonUpdate,
    ): CancelablePromise<PersonUpdate> {
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
