/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DiaryCreate } from '../models/DiaryCreate';
import type { DiaryRetrieve } from '../models/DiaryRetrieve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PersonalDiaryService {
  /**
   * Manage Personal Diary Entries
   *
   * Personal diary management system for authenticated users.
   *
   * **GET - Retrieve Personal Diary Entries:**
   * - Returns ONLY diary entries belonging to the authenticated user
   * - Supports optional limit parameter for pagination
   * - Ordered by most recent entries first
   * - Complete access to personal diary content
   *
   * **POST - Create New Diary Entry:**
   * - Creates personal diary entry for authenticated user
   * - Supports text content, mood tracking, and sharing preferences
   * - Automatically timestamps entries
   * - Optional sharing with linked providers
   *
   * **Security:**
   * - Users can only see their own diary entries
   * - Private by default with optional provider sharing
   * - Complete access control per user
   *
   * **Privacy Controls:**
   * - Entries are private by default
   * - User explicitly chooses which entries to share
   * - Shared entries visible to linked providers only
   * - User maintains full control over personal data
   *
   * @param limit Maximum number of diary entries to return
   * @returns DiaryRetrieve
   * @throws ApiError
   */
  public static diariesList(limit?: number): CancelablePromise<Array<DiaryRetrieve>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/diaries/',
      query: {
        limit: limit,
      },
    });
  }
  /**
   * Create New Personal Diary Entry
   *
   * Creates a new personal diary entry for the authenticated user.
   *
   * **Security Requirements:**
   * - User must have valid Person profile
   * - Entry is automatically linked to authenticated user
   * - Cannot create entries for other users
   *
   * **Entry Creation Process:**
   * 1. **User Verification**: Confirms user has valid Person profile
   * 2. **Content Validation**: Validates diary content and metadata
   * 3. **Auto-Association**: Links entry to authenticated user's Person profile
   * 4. **Timestamp Assignment**: Automatically sets creation timestamp
   * 5. **Privacy Configuration**: Sets sharing preferences
   *
   * @param requestBody
   * @param limit Maximum number of diary entries to return
   * @returns any
   * @throws ApiError
   */
  public static diariesCreate(requestBody: DiaryCreate, limit?: number): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/diaries/',
      query: {
        limit: limit,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Personal Diary Entry Details and Management
   *
   * Individual diary entry operations with strict ownership validation.
   *
   * **GET - View Personal Diary Entry:**
   * - Retrieves complete details of user's own diary entry
   * - Validates entry belongs to authenticated user
   * - Includes all metadata, content, and sharing status
   *
   * **DELETE - Remove Personal Diary Entry:**
   * - Permanently deletes user's own diary entry
   * - Validates ownership before deletion
   * - Cannot delete other users' entries
   * - Audit logging for deletion tracking
   *
   * **Security Requirements:**
   * - User must own the diary entry
   * - Entry must exist and be accessible to user
   * - Cannot access other users' diary entries
   *
   * @param diaryId
   * @returns DiaryRetrieve
   * @throws ApiError
   */
  public static diariesRetrieve(diaryId: string): CancelablePromise<DiaryRetrieve> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/diaries/{diary_id}/',
      path: {
        diary_id: diaryId,
      },
    });
  }
  /**
   * Delete Personal Diary Entry
   *
   * Permanently deletes user's own diary entry with ownership validation.
   *
   * **⚠️ PERMANENT ACTION - CANNOT BE UNDONE ⚠️**
   *
   * **Security Process:**
   * 1. **User Verification**: Confirms user has Person profile
   * 2. **Ownership Validation**: Verifies diary belongs to user
   * 3. **Permission Check**: Ensures user can delete this entry
   * 4. **Permanent Removal**: Deletes entry from database
   * 5. **Audit Logging**: Records deletion for compliance
   *
   * @param diaryId Unique identifier of your diary entry to delete
   * @returns any
   * @throws ApiError
   */
  public static diariesDestroy(diaryId: number): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/diaries/{diary_id}/',
      path: {
        diary_id: diaryId,
      },
    });
  }
  /**
   * Get Personal Diary Entries (Alternative Endpoint)
   *
   * Alternative endpoint for retrieving personal diary entries.
   *
   * **Functionality:**
   * - Returns only diary entries belonging to the authenticated Person
   * - Includes both private and shared entries
   * - Ordered chronologically (most recent first)
   * - Complete access to all personal diary content
   *
   * **Security:**
   * - Strict ownership validation
   * - Cannot access other users' diaries
   * - Person profile required
   *
   * @returns DiaryRetrieve
   * @throws ApiError
   */
  public static personDiariesList(): CancelablePromise<Array<DiaryRetrieve>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/person/diaries/',
    });
  }
}
