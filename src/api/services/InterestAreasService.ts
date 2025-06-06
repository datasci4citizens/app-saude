/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterestArea } from "../models/InterestArea";
import type { PatchedInterestAreaBulkUpdate } from "../models/PatchedInterestAreaBulkUpdate";
import type { PatchedMarkAttentionPoint } from "../models/PatchedMarkAttentionPoint";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class InterestAreasService {
  /**
   * @returns InterestArea
   * @throws ApiError
   */
  public static personInterestAreasList(): CancelablePromise<
    Array<InterestArea>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/person/interest-areas/",
    });
  }
  /**
   * @param requestBody
   * @returns InterestArea
   * @throws ApiError
   */
  public static personInterestAreasCreate(
    requestBody?: InterestArea,
  ): CancelablePromise<InterestArea> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/person/interest-areas/",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param requestBody
   * @returns any
   * @throws ApiError
   */
  public static personInterestAreasPartialUpdate(
    requestBody?: PatchedInterestAreaBulkUpdate,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/person/interest-areas/",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param interestAreaId
   * @returns InterestArea
   * @throws ApiError
   */
  public static personInterestAreasRetrieve(
    interestAreaId: number,
  ): CancelablePromise<InterestArea> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/person/interest-areas/{interest_area_id}/",
      path: {
        interest_area_id: interestAreaId,
      },
    });
  }
  /**
   * @param interestAreaId
   * @returns void
   * @throws ApiError
   */
  public static personInterestAreasDestroy(
    interestAreaId: number,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/person/interest-areas/{interest_area_id}/",
      path: {
        interest_area_id: interestAreaId,
      },
    });
  }
  /**
   * Marcar área como ponto de atenção
   * @param requestBody
   * @returns void
   * @throws ApiError
   */
  public static markObservationAsAttentionPoint(
    requestBody?: PatchedMarkAttentionPoint,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/person/interest-areas/mark-attention-point/",
      body: requestBody,
      mediaType: "application/json",
    });
  }
}
