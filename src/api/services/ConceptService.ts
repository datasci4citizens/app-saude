/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConceptCreate } from "../models/ConceptCreate";
import type { ConceptRetrieve } from "../models/ConceptRetrieve";
import type { ConceptUpdate } from "../models/ConceptUpdate";
import type { PatchedConceptUpdate } from "../models/PatchedConceptUpdate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ConceptService {
  /**
   * @param _class concept_class_id list (ex: class=Gender,Ethnicity)
   * @param lang Translation language (ex: pt)
   * @param relationship relationship_id to search for each concept (ex: has_value_type)
   * @returns ConceptRetrieve
   * @throws ApiError
   */
  public static apiConceptList(
    _class?: string,
    lang?: string,
    relationship?: string,
  ): CancelablePromise<Array<ConceptRetrieve>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/concept/",
      query: {
        class: _class,
        lang: lang,
        relationship: relationship,
      },
    });
  }
  /**
   * @param _class concept_class_id list (ex: class=Gender,Ethnicity)
   * @param lang Translation language (ex: pt)
   * @param relationship relationship_id to search for each concept (ex: has_value_type)
   * @param requestBody
   * @returns ConceptCreate
   * @throws ApiError
   */
  public static apiConceptCreate(
    _class?: string,
    lang?: string,
    relationship?: string,
    requestBody?: ConceptCreate,
  ): CancelablePromise<ConceptCreate> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/concept/",
      query: {
        class: _class,
        lang: lang,
        relationship: relationship,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param conceptId A unique integer value identifying this concept.
   * @param _class concept_class_id list (ex: class=Gender,Ethnicity)
   * @param lang Translation language (ex: pt)
   * @param relationship relationship_id to search for each concept (ex: has_value_type)
   * @returns ConceptRetrieve
   * @throws ApiError
   */
  public static apiConceptRetrieve(
    conceptId: number,
    _class?: string,
    lang?: string,
    relationship?: string,
  ): CancelablePromise<ConceptRetrieve> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/concept/{concept_id}/",
      path: {
        concept_id: conceptId,
      },
      query: {
        class: _class,
        lang: lang,
        relationship: relationship,
      },
    });
  }
  /**
   * @param conceptId A unique integer value identifying this concept.
   * @param _class concept_class_id list (ex: class=Gender,Ethnicity)
   * @param lang Translation language (ex: pt)
   * @param relationship relationship_id to search for each concept (ex: has_value_type)
   * @param requestBody
   * @returns ConceptUpdate
   * @throws ApiError
   */
  public static apiConceptUpdate(
    conceptId: number,
    _class?: string,
    lang?: string,
    relationship?: string,
    requestBody?: ConceptUpdate,
  ): CancelablePromise<ConceptUpdate> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/concept/{concept_id}/",
      path: {
        concept_id: conceptId,
      },
      query: {
        class: _class,
        lang: lang,
        relationship: relationship,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param conceptId A unique integer value identifying this concept.
   * @param _class concept_class_id list (ex: class=Gender,Ethnicity)
   * @param lang Translation language (ex: pt)
   * @param relationship relationship_id to search for each concept (ex: has_value_type)
   * @param requestBody
   * @returns ConceptUpdate
   * @throws ApiError
   */
  public static apiConceptPartialUpdate(
    conceptId: number,
    _class?: string,
    lang?: string,
    relationship?: string,
    requestBody?: PatchedConceptUpdate,
  ): CancelablePromise<ConceptUpdate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/concept/{concept_id}/",
      path: {
        concept_id: conceptId,
      },
      query: {
        class: _class,
        lang: lang,
        relationship: relationship,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param conceptId A unique integer value identifying this concept.
   * @param _class concept_class_id list (ex: class=Gender,Ethnicity)
   * @param lang Translation language (ex: pt)
   * @param relationship relationship_id to search for each concept (ex: has_value_type)
   * @returns void
   * @throws ApiError
   */
  public static apiConceptDestroy(
    conceptId: number,
    _class?: string,
    lang?: string,
    relationship?: string,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/concept/{concept_id}/",
      path: {
        concept_id: conceptId,
      },
      query: {
        class: _class,
        lang: lang,
        relationship: relationship,
      },
    });
  }
}
