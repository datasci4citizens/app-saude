/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DrugExposureCreate } from "../models/DrugExposureCreate";
import type { DrugExposureRetrieve } from "../models/DrugExposureRetrieve";
import type { DrugExposureUpdate } from "../models/DrugExposureUpdate";
import type { PatchedDrugExposureUpdate } from "../models/PatchedDrugExposureUpdate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class DrugExposureService {
  /**
   * @returns DrugExposureRetrieve
   * @throws ApiError
   */
  public static apiDrugExposureList(): CancelablePromise<
    Array<DrugExposureRetrieve>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/drug-exposure/",
    });
  }
  /**
   * @param requestBody
   * @returns DrugExposureCreate
   * @throws ApiError
   */
  public static apiDrugExposureCreate(
    requestBody?: DrugExposureCreate,
  ): CancelablePromise<DrugExposureCreate> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/drug-exposure/",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param drugExposureId A unique integer value identifying this drug exposure.
   * @returns DrugExposureRetrieve
   * @throws ApiError
   */
  public static apiDrugExposureRetrieve(
    drugExposureId: number,
  ): CancelablePromise<DrugExposureRetrieve> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/drug-exposure/{drug_exposure_id}/",
      path: {
        drug_exposure_id: drugExposureId,
      },
    });
  }
  /**
   * @param drugExposureId A unique integer value identifying this drug exposure.
   * @param requestBody
   * @returns DrugExposureUpdate
   * @throws ApiError
   */
  public static apiDrugExposureUpdate(
    drugExposureId: number,
    requestBody?: DrugExposureUpdate,
  ): CancelablePromise<DrugExposureUpdate> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/drug-exposure/{drug_exposure_id}/",
      path: {
        drug_exposure_id: drugExposureId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param drugExposureId A unique integer value identifying this drug exposure.
   * @param requestBody
   * @returns DrugExposureUpdate
   * @throws ApiError
   */
  public static apiDrugExposurePartialUpdate(
    drugExposureId: number,
    requestBody?: PatchedDrugExposureUpdate,
  ): CancelablePromise<DrugExposureUpdate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/drug-exposure/{drug_exposure_id}/",
      path: {
        drug_exposure_id: drugExposureId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param drugExposureId A unique integer value identifying this drug exposure.
   * @returns void
   * @throws ApiError
   */
  public static apiDrugExposureDestroy(
    drugExposureId: number,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/drug-exposure/{drug_exposure_id}/",
      path: {
        drug_exposure_id: drugExposureId,
      },
    });
  }
}
