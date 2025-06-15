/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonLinkProviderRequest } from '../models/PersonLinkProviderRequest';
import type { PersonLinkProviderResponse } from '../models/PersonLinkProviderResponse';
import type { PersonProviderUnlinkResponse } from '../models/PersonProviderUnlinkResponse';
import type { ProviderLinkCodeResponse } from '../models/ProviderLinkCodeResponse';
import type { ProviderPersonSummary } from '../models/ProviderPersonSummary';
import type { ProviderRetrieve } from '../models/ProviderRetrieve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LinkPersonProviderService {
    /**
     * @param personId
     * @param providerId
     * @returns PersonProviderUnlinkResponse
     * @throws ApiError
     */
    public static personProviderUnlinkCreate(
        personId: number,
        providerId: number,
    ): CancelablePromise<PersonProviderUnlinkResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/person/{person_id}/provider/{provider_id}/unlink/',
            path: {
                'person_id': personId,
                'provider_id': providerId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns PersonLinkProviderResponse
     * @throws ApiError
     */
    public static personLinkCodeCreate(
        requestBody: PersonLinkProviderRequest,
    ): CancelablePromise<PersonLinkProviderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/person/link-code/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ProviderRetrieve
     * @throws ApiError
     */
    public static personProvidersList(): CancelablePromise<Array<ProviderRetrieve>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/person/providers/',
        });
    }
    /**
     * @param requestBody
     * @returns ProviderRetrieve
     * @throws ApiError
     */
    public static providerByLinkCodeCreate(
        requestBody: PersonLinkProviderRequest,
    ): CancelablePromise<ProviderRetrieve> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/provider/by-link-code/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ProviderLinkCodeResponse
     * @throws ApiError
     */
    public static providerLinkCodeCreate(): CancelablePromise<ProviderLinkCodeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/provider/link-code/',
        });
    }
    /**
     * View to retrieve all patients linked to the authenticated provider additional information
     * @returns ProviderPersonSummary
     * @throws ApiError
     */
    public static providerPersonsList(): CancelablePromise<Array<ProviderPersonSummary>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/provider/persons/',
        });
    }
}
