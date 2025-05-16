/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConceptClassCreate } from "../models/ConceptClassCreate";
import type { ConceptClassRetrieve } from "../models/ConceptClassRetrieve";
import type { ConceptClassUpdate } from "../models/ConceptClassUpdate";
import type { PatchedConceptClassUpdate } from "../models/PatchedConceptClassUpdate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ConceptClassService {
  /**
   * @returns ConceptClassRetrieve
   * @throws ApiError
   */
  public static apiConceptClassList(): CancelablePromise<
    Array<ConceptClassRetrieve>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/concept-class/",
    });
  }
  /**
   * @param requestBody
   * @returns ConceptClassCreate
   * @throws ApiError
   */
  public static apiConceptClassCreate(
    requestBody?: ConceptClassCreate,
  ): CancelablePromise<ConceptClassCreate> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/concept-class/",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param conceptClassId A unique value identifying this concept class.
   * @returns ConceptClassRetrieve
   * @throws ApiError
   */
  public static apiConceptClassRetrieve(
    conceptClassId: string,
  ): CancelablePromise<ConceptClassRetrieve> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/concept-class/{concept_class_id}/",
      path: {
        concept_class_id: conceptClassId,
      },
    });
  }
  /**
   * @param conceptClassId A unique value identifying this concept class.
   * @param requestBody
   * @returns ConceptClassUpdate
   * @throws ApiError
   */
  public static apiConceptClassUpdate(
    conceptClassId: string,
    requestBody: ConceptClassUpdate,
  ): CancelablePromise<ConceptClassUpdate> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/concept-class/{concept_class_id}/",
      path: {
        concept_class_id: conceptClassId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param conceptClassId A unique value identifying this concept class.
   * @param requestBody
   * @returns ConceptClassUpdate
   * @throws ApiError
   */
  public static apiConceptClassPartialUpdate(
    conceptClassId: string,
    requestBody?: PatchedConceptClassUpdate,
  ): CancelablePromise<ConceptClassUpdate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/concept-class/{concept_class_id}/",
      path: {
        concept_class_id: conceptClassId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param conceptClassId A unique value identifying this concept class.
   * @returns void
   * @throws ApiError
   */
  public static apiConceptClassDestroy(
    conceptClassId: string,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/concept-class/{concept_class_id}/",
      path: {
        concept_class_id: conceptClassId,
      },
    });
  }
}
