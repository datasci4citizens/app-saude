/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterestAreaCreate } from '../models/InterestAreaCreate';
import type { InterestAreaUpdate } from '../models/InterestAreaUpdate';
import type { PatchedInterestAreaUpdate } from '../models/PatchedInterestAreaUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InterestAreasService {
  /**
   * Interest Area Management
   *
   * Personal interest area management with strict access control.
   *
   * **Security Requirements:**
   * - User must have valid Person profile to manage interest areas
   * - Users can only access their own interest areas
   * - Filtering by person_id restricts to authenticated user's data
   *
   * **Access Control:**
   * - Person profile validation required
   * - Interest areas filtered by authenticated user
   * - Cannot access other users' interest areas
   *
   * @param personId Filter interest areas by person ID (restricted to your own)
   * @returns any No response body
   * @throws ApiError
   */
  public static apiInterestAreaList(personId?: number): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/interest-area/',
      query: {
        person_id: personId,
      },
    });
  }
  /**
   * Create New Personal Interest Area
   *
   * Creates a new interest area for the authenticated user only.
   *
   * **Security Features:**
   * - Automatically associates with authenticated user's Person profile
   * - Cannot create interest areas for other users
   * - Person profile validation required
   *
   * @param requestBody
   * @param personId Filter interest areas by person ID (restricted to your own)
   * @returns any No response body
   * @throws ApiError
   */
  public static apiInterestAreaCreate(
    requestBody: InterestAreaCreate,
    personId?: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/interest-area/',
      query: {
        person_id: personId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Interest Area Management
   *
   * Personal interest area management with strict access control.
   *
   * **Security Requirements:**
   * - User must have valid Person profile to manage interest areas
   * - Users can only access their own interest areas
   * - Filtering by person_id restricts to authenticated user's data
   *
   * **Access Control:**
   * - Person profile validation required
   * - Interest areas filtered by authenticated user
   * - Cannot access other users' interest areas
   *
   * @param id
   * @param personId Filter interest areas by person ID (restricted to your own)
   * @returns any No response body
   * @throws ApiError
   */
  public static apiInterestAreaRetrieve(id: string, personId?: number): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/interest-area/{id}/',
      path: {
        id: id,
      },
      query: {
        person_id: personId,
      },
    });
  }
  /**
   * Update Personal Interest Area
   *
   * Updates an existing interest area with ownership validation.
   *
   * **Security Features:**
   * - Validates interest area belongs to authenticated user
   * - Cannot update other users' interest areas
   * - Ownership verification required
   *
   * @param id
   * @param requestBody
   * @param personId Filter interest areas by person ID (restricted to your own)
   * @returns any No response body
   * @throws ApiError
   */
  public static apiInterestAreaUpdate(
    id: string,
    requestBody: InterestAreaUpdate,
    personId?: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/interest-area/{id}/',
      path: {
        id: id,
      },
      query: {
        person_id: personId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Interest Area Management
   *
   * Personal interest area management with strict access control.
   *
   * **Security Requirements:**
   * - User must have valid Person profile to manage interest areas
   * - Users can only access their own interest areas
   * - Filtering by person_id restricts to authenticated user's data
   *
   * **Access Control:**
   * - Person profile validation required
   * - Interest areas filtered by authenticated user
   * - Cannot access other users' interest areas
   *
   * @param id
   * @param personId Filter interest areas by person ID (restricted to your own)
   * @param requestBody
   * @returns InterestAreaUpdate
   * @throws ApiError
   */
  public static apiInterestAreaPartialUpdate(
    id: string,
    personId?: number,
    requestBody?: PatchedInterestAreaUpdate,
  ): CancelablePromise<InterestAreaUpdate> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/interest-area/{id}/',
      path: {
        id: id,
      },
      query: {
        person_id: personId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Interest Area Management
   *
   * Personal interest area management with strict access control.
   *
   * **Security Requirements:**
   * - User must have valid Person profile to manage interest areas
   * - Users can only access their own interest areas
   * - Filtering by person_id restricts to authenticated user's data
   *
   * **Access Control:**
   * - Person profile validation required
   * - Interest areas filtered by authenticated user
   * - Cannot access other users' interest areas
   *
   * @param id
   * @param personId Filter interest areas by person ID (restricted to your own)
   * @returns void
   * @throws ApiError
   */
  public static apiInterestAreaDestroy(id: string, personId?: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/interest-area/{id}/',
      path: {
        id: id,
      },
      query: {
        person_id: personId,
      },
    });
  }
}
