/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MeasurementCreate } from "../models/MeasurementCreate";
import type { MeasurementRetrieve } from "../models/MeasurementRetrieve";
import type { MeasurementUpdate } from "../models/MeasurementUpdate";
import type { PatchedMeasurementUpdate } from "../models/PatchedMeasurementUpdate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class MeasurementService {
  /**
   * @returns MeasurementRetrieve
   * @throws ApiError
   */
  public static apiMeasurementList(): CancelablePromise<
    Array<MeasurementRetrieve>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/measurement/",
    });
  }
  /**
   * @param requestBody
   * @returns MeasurementCreate
   * @throws ApiError
   */
  public static apiMeasurementCreate(
    requestBody?: MeasurementCreate,
  ): CancelablePromise<MeasurementCreate> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/measurement/",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param measurementId A unique integer value identifying this measurement.
   * @returns MeasurementRetrieve
   * @throws ApiError
   */
  public static apiMeasurementRetrieve(
    measurementId: number,
  ): CancelablePromise<MeasurementRetrieve> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/measurement/{measurement_id}/",
      path: {
        measurement_id: measurementId,
      },
    });
  }
  /**
   * @param measurementId A unique integer value identifying this measurement.
   * @param requestBody
   * @returns MeasurementUpdate
   * @throws ApiError
   */
  public static apiMeasurementUpdate(
    measurementId: number,
    requestBody?: MeasurementUpdate,
  ): CancelablePromise<MeasurementUpdate> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/measurement/{measurement_id}/",
      path: {
        measurement_id: measurementId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param measurementId A unique integer value identifying this measurement.
   * @param requestBody
   * @returns MeasurementUpdate
   * @throws ApiError
   */
  public static apiMeasurementPartialUpdate(
    measurementId: number,
    requestBody?: PatchedMeasurementUpdate,
  ): CancelablePromise<MeasurementUpdate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/measurement/{measurement_id}/",
      path: {
        measurement_id: measurementId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param measurementId A unique integer value identifying this measurement.
   * @returns void
   * @throws ApiError
   */
  public static apiMeasurementDestroy(
    measurementId: number,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/measurement/{measurement_id}/",
      path: {
        measurement_id: measurementId,
      },
    });
  }
}
