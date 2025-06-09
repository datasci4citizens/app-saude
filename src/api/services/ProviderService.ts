/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DiaryRetrieve } from '../models/DiaryRetrieve';
import type { PatchedProviderUpdate } from '../models/PatchedProviderUpdate';
import type { ProviderCreate } from '../models/ProviderCreate';
import type { ProviderRetrieve } from '../models/ProviderRetrieve';
import type { ProviderUpdate } from '../models/ProviderUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProviderService {
    /**
     * @param birthDatetime
     * @param careSite
     * @param createdAt
     * @param ordering Which field to use when ordering the results.
     * @param professionalRegistration
     * @param profilePicture
     * @param search A search term.
     * @param socialName
     * @param specialtyConcept
     * @param updatedAt
     * @param user
     * @returns ProviderRetrieve
     * @throws ApiError
     */
    public static apiProviderList(
        birthDatetime?: string,
        careSite?: number,
        createdAt?: string,
        ordering?: string,
        professionalRegistration?: number,
        profilePicture?: string,
        search?: string,
        socialName?: string,
        specialtyConcept?: number,
        updatedAt?: string,
        user?: number,
    ): CancelablePromise<Array<ProviderRetrieve>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/provider/',
            query: {
                'birth_datetime': birthDatetime,
                'care_site': careSite,
                'created_at': createdAt,
                'ordering': ordering,
                'professional_registration': professionalRegistration,
                'profile_picture': profilePicture,
                'search': search,
                'social_name': socialName,
                'specialty_concept': specialtyConcept,
                'updated_at': updatedAt,
                'user': user,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ProviderRetrieve
     * @throws ApiError
     */
    public static apiProviderCreate(
        requestBody?: ProviderCreate,
    ): CancelablePromise<ProviderRetrieve> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/provider/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param providerId A unique integer value identifying this provider.
     * @returns ProviderRetrieve
     * @throws ApiError
     */
    public static apiProviderRetrieve(
        providerId: number,
    ): CancelablePromise<ProviderRetrieve> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/provider/{provider_id}/',
            path: {
                'provider_id': providerId,
            },
        });
    }
    /**
     * @param providerId A unique integer value identifying this provider.
     * @param requestBody
     * @returns ProviderUpdate
     * @throws ApiError
     */
    public static apiProviderUpdate(
        providerId: number,
        requestBody?: ProviderUpdate,
    ): CancelablePromise<ProviderUpdate> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/provider/{provider_id}/',
            path: {
                'provider_id': providerId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param providerId A unique integer value identifying this provider.
     * @param requestBody
     * @returns ProviderUpdate
     * @throws ApiError
     */
    public static apiProviderPartialUpdate(
        providerId: number,
        requestBody?: PatchedProviderUpdate,
    ): CancelablePromise<ProviderUpdate> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/provider/{provider_id}/',
            path: {
                'provider_id': providerId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param providerId A unique integer value identifying this provider.
     * @returns void
     * @throws ApiError
     */
    public static apiProviderDestroy(
        providerId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/provider/{provider_id}/',
            path: {
                'provider_id': providerId,
            },
        });
    }
    /**
     * @param personId
     * @returns DiaryRetrieve
     * @throws ApiError
     */
    public static providerPatientsDiariesList(
        personId: number,
    ): CancelablePromise<Array<DiaryRetrieve>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/provider/patients/{person_id}/diaries/',
            path: {
                'person_id': personId,
            },
        });
    }
    /**
     * @param diaryId
     * @param personId
     * @returns any No response body
     * @throws ApiError
     */
    public static providerPatientsDiariesRetrieve(
        diaryId: string,
        personId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/provider/patients/{person_id}/diaries/{diary_id}/',
            path: {
                'diary_id': diaryId,
                'person_id': personId,
            },
        });
    }
}
