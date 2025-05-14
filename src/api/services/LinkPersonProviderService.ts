/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonLinkProviderRequest } from '../models/PersonLinkProviderRequest';
import type { PersonLinkProviderResponse } from '../models/PersonLinkProviderResponse';
import type { PersonRetrieve } from '../models/PersonRetrieve';
import type { ProviderLinkCodeResponse } from '../models/ProviderLinkCodeResponse';
import type { ProviderRetrieve } from '../models/ProviderRetrieve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LinkPersonProviderService {
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
     * @returns PersonRetrieve
     * @throws ApiError
     */
    public static providerPersonsList(): CancelablePromise<Array<PersonRetrieve>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/provider/persons/',
        });
    }
}
