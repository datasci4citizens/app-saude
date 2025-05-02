/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Domain } from '../models/Domain';
import type { PatchedDomain } from '../models/PatchedDomain';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DomainService {
    /**
     * @returns Domain
     * @throws ApiError
     */
    public static apiDomainList(): CancelablePromise<Array<Domain>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/domain/',
        });
    }
    /**
     * @param requestBody
     * @returns Domain
     * @throws ApiError
     */
    public static apiDomainCreate(
        requestBody: Domain,
    ): CancelablePromise<Domain> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/domain/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param domainId A unique value identifying this domain.
     * @returns Domain
     * @throws ApiError
     */
    public static apiDomainRetrieve(
        domainId: string,
    ): CancelablePromise<Domain> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/domain/{domain_id}/',
            path: {
                'domain_id': domainId,
            },
        });
    }
    /**
     * @param domainId A unique value identifying this domain.
     * @param requestBody
     * @returns Domain
     * @throws ApiError
     */
    public static apiDomainUpdate(
        domainId: string,
        requestBody: Domain,
    ): CancelablePromise<Domain> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/domain/{domain_id}/',
            path: {
                'domain_id': domainId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param domainId A unique value identifying this domain.
     * @param requestBody
     * @returns Domain
     * @throws ApiError
     */
    public static apiDomainPartialUpdate(
        domainId: string,
        requestBody?: PatchedDomain,
    ): CancelablePromise<Domain> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/domain/{domain_id}/',
            path: {
                'domain_id': domainId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param domainId A unique value identifying this domain.
     * @returns void
     * @throws ApiError
     */
    public static apiDomainDestroy(
        domainId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/domain/{domain_id}/',
            path: {
                'domain_id': domainId,
            },
        });
    }
}
