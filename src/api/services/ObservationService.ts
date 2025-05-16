/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ObservationCreate } from "../models/ObservationCreate";
import type { ObservationRetrieve } from "../models/ObservationRetrieve";
import type { ObservationUpdate } from "../models/ObservationUpdate";
import type { PatchedObservationUpdate } from "../models/PatchedObservationUpdate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ObservationService {
  /**
   * @returns ObservationRetrieve
   * @throws ApiError
   */
  public static apiObservationList(): CancelablePromise<
    Array<ObservationRetrieve>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/observation/",
    });
  }
  /**
   * @param requestBody
   * @returns ObservationCreate
   * @throws ApiError
   */
  public static apiObservationCreate(
    requestBody?: ObservationCreate,
  ): CancelablePromise<ObservationCreate> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/observation/",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param observationId A unique integer value identifying this observation.
   * @returns ObservationRetrieve
   * @throws ApiError
   */
  public static apiObservationRetrieve(
    observationId: number,
  ): CancelablePromise<ObservationRetrieve> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/observation/{observation_id}/",
      path: {
        observation_id: observationId,
      },
    });
  }
  /**
   * @param observationId A unique integer value identifying this observation.
   * @param requestBody
   * @returns ObservationUpdate
   * @throws ApiError
   */
  public static apiObservationUpdate(
    observationId: number,
    requestBody?: ObservationUpdate,
  ): CancelablePromise<ObservationUpdate> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/observation/{observation_id}/",
      path: {
        observation_id: observationId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param observationId A unique integer value identifying this observation.
   * @param requestBody
   * @returns ObservationUpdate
   * @throws ApiError
   */
  public static apiObservationPartialUpdate(
    observationId: number,
    requestBody?: PatchedObservationUpdate,
  ): CancelablePromise<ObservationUpdate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/observation/{observation_id}/",
      path: {
        observation_id: observationId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param observationId A unique integer value identifying this observation.
   * @returns void
   * @throws ApiError
   */
  public static apiObservationDestroy(
    observationId: number,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/observation/{observation_id}/",
      path: {
        observation_id: observationId,
      },
    });
  }
}
