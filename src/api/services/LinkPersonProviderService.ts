/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonLinkProviderRequest } from '../models/PersonLinkProviderRequest';
import type { PersonLinkProviderResponse } from '../models/PersonLinkProviderResponse';
import type { ProviderLinkCodeResponse } from '../models/ProviderLinkCodeResponse';
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
     * @returns ProviderLinkCodeResponse
     * @throws ApiError
     */
    public static providerLinkCodeCreate(): CancelablePromise<ProviderLinkCodeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/provider/link-code/',
        });
    }
}
