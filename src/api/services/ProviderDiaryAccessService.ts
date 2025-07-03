/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DiaryRetrieve } from '../models/DiaryRetrieve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProviderDiaryAccessService {
  /**
   * Get Person's Shared Diary Entries
   *
   * Retrieves diary entries shared by a specific Person with the authenticated Provider.
   *
   * **Security Requirements:**
   * - Provider must be authenticated and have valid Provider profile
   * - Provider must be linked to the specified Person
   * - Only entries explicitly shared with providers are returned
   * - Strict validation of Provider-Person relationship
   *
   * **Access Control:**
   * - Validates Provider-Person relationship exists
   * - Filters out private/unshared diary entries
   * - Cannot access entries from non-linked Persons
   * - Ensures proper authorization for diary access
   *
   * @param personId
   * @returns DiaryRetrieve
   * @throws ApiError
   */
  public static providerPatientsDiariesList(
    personId: number,
  ): CancelablePromise<Array<DiaryRetrieve>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/provider/patients/{person_id}/diaries/',
      path: {
        person_id: personId,
      },
    });
  }
  /**
   * Get Specific Shared Diary Entry
   *
   * Retrieves details of a specific diary entry shared by a Person with the Provider.
   *
   * **Multi-Layer Security Validation:**
   * 1. **Provider Authentication**: User must be authenticated Provider
   * 2. **Person Existence**: Specified Person must exist
   * 3. **Relationship Validation**: Provider must be linked to Person
   * 4. **Entry Ownership**: Diary must belong to specified Person
   * 5. **Sharing Permission**: Entry must be marked as shared with providers
   *
   * **Access Control Flow:**
   * - Validates Provider has valid profile
   * - Confirms Person exists in system
   * - Verifies active Provider-Person relationship
   * - Ensures diary belongs to specified Person
   * - Checks entry is explicitly shared with providers
   *
   * @param diaryId
   * @param personId
   * @returns DiaryRetrieve
   * @throws ApiError
   */
  public static providerPatientsDiariesRetrieve(
    diaryId: string,
    personId: number,
  ): CancelablePromise<DiaryRetrieve> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/provider/patients/{person_id}/diaries/{diary_id}/',
      path: {
        diary_id: diaryId,
        person_id: personId,
      },
    });
  }
}
