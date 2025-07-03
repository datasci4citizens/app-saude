/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedMarkAttentionPoint } from '../models/PatchedMarkAttentionPoint';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProviderInterestManagementService {
  /**
   * Mark Interest Area as Attention Point
   *
   * Allows providers to mark interest areas as attention points with relationship validation.
   *
   * **Security Requirements:**
   * - Provider must be authenticated with valid Provider profile
   * - Interest area must exist and be accessible
   * - Provider must be linked to the Person who owns the interest area
   * - Cannot mark interest areas from non-linked Persons
   *
   * **Validation Process:**
   * 1. **Provider Authentication**: Confirms valid Provider profile
   * 2. **Interest Area Validation**: Verifies interest area exists
   * 3. **Relationship Check**: Ensures Provider is linked to interest area owner
   * 4. **Marking Authorization**: Validates Provider can mark this area
   *
   * @param requestBody
   * @returns any
   * @throws ApiError
   */
  public static personInterestAreasMarkAttentionPointPartialUpdate(
    requestBody?: PatchedMarkAttentionPoint,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/person/interest-areas/mark-attention-point/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
