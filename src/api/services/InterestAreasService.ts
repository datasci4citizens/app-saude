/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterestAreaCreate } from '../models/InterestAreaCreate';
import type { InterestAreaUpdate } from '../models/InterestAreaUpdate';
import type { PatchedInterestArea } from '../models/PatchedInterestArea';
import type { PatchedMarkAttentionPoint } from '../models/PatchedMarkAttentionPoint';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InterestAreasService {
  /**
   * @param personId Filter interest areas by person ID
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
   * @param requestBody
   * @param personId Filter interest areas by person ID
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
   * @param id
   * @param personId Filter interest areas by person ID
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
   * @param id
   * @param requestBody
   * @param personId Filter interest areas by person ID
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
   * @param id
   * @param personId Filter interest areas by person ID
   * @param requestBody
   * @returns any No response body
   * @throws ApiError
   */
  public static apiInterestAreaPartialUpdate(
    id: string,
    personId?: number,
    requestBody?: PatchedInterestArea,
  ): CancelablePromise<any> {
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
   * @param id
   * @param personId Filter interest areas by person ID
   * @returns any No response body
   * @throws ApiError
   */
  public static apiInterestAreaDestroy(id: string, personId?: number): CancelablePromise<any> {
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
      method: 'PATCH',
      url: '/person/interest-areas/mark-attention-point/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
