/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DomainCreate } from "../models/DomainCreate";
import type { DomainRetrieve } from "../models/DomainRetrieve";
import type { DomainUpdate } from "../models/DomainUpdate";
import type { PatchedDomainUpdate } from "../models/PatchedDomainUpdate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class DomainService {
  /**
   * @returns DomainRetrieve
   * @throws ApiError
   */
  public static apiDomainList(): CancelablePromise<Array<DomainRetrieve>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/domain/",
    });
  }
  /**
   * @param requestBody
   * @returns DomainCreate
   * @throws ApiError
   */
  public static apiDomainCreate(
    requestBody?: DomainCreate,
  ): CancelablePromise<DomainCreate> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/domain/",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param domainId A unique value identifying this domain.
   * @returns DomainRetrieve
   * @throws ApiError
   */
  public static apiDomainRetrieve(
    domainId: string,
  ): CancelablePromise<DomainRetrieve> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/domain/{domain_id}/",
      path: {
        domain_id: domainId,
      },
    });
  }
  /**
   * @param domainId A unique value identifying this domain.
   * @param requestBody
   * @returns DomainUpdate
   * @throws ApiError
   */
  public static apiDomainUpdate(
    domainId: string,
    requestBody: DomainUpdate,
  ): CancelablePromise<DomainUpdate> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/domain/{domain_id}/",
      path: {
        domain_id: domainId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param domainId A unique value identifying this domain.
   * @param requestBody
   * @returns DomainUpdate
   * @throws ApiError
   */
  public static apiDomainPartialUpdate(
    domainId: string,
    requestBody?: PatchedDomainUpdate,
  ): CancelablePromise<DomainUpdate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/domain/{domain_id}/",
      path: {
        domain_id: domainId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param domainId A unique value identifying this domain.
   * @returns void
   * @throws ApiError
   */
  public static apiDomainDestroy(domainId: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/domain/{domain_id}/",
      path: {
        domain_id: domainId,
      },
    });
  }
}
