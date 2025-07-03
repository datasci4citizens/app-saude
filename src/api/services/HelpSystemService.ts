/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HelpCount } from '../models/HelpCount';
import type { HelpCreate } from '../models/HelpCreate';
import type { ObservationRetrieve } from '../models/ObservationRetrieve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HelpSystemService {
  /**
   * Send Help Request
   *
   * Creates new help requests from authenticated Person to linked Providers only.
   *
   * **Security Requirements:**
   * - Person must be authenticated and have Person profile
   * - Can only send help requests to linked Providers
   * - Cannot send help requests to non-linked Providers
   * - Validates Provider relationship before creating requests
   *
   * **Help Request System:**
   * - Persons can send help requests to their linked Providers
   * - Multiple help requests can be sent in a single API call
   * - Each help request is stored as an Observation with ACTIVE status
   * - Providers receive notifications about new help requests
   *
   * **Request Processing:**
   * 1. **Person Verification**: Confirms user has valid Person profile
   * 2. **Provider Validation**: Ensures all target providers are linked
   * 3. **Bulk Creation**: Processes multiple help requests atomically
   * 4. **Auto-Timestamps**: Sets observation_date to current time
   * 5. **Status Setting**: Marks all new requests as ACTIVE
   *
   * **Security Features:**
   * - Validates Person-Provider relationships before creating requests
   * - Cannot send help to unlinked providers
   * - Atomic transaction ensures data consistency
   * - Complete audit logging of all operations
   *
   * @param requestBody
   * @returns ObservationRetrieve
   * @throws ApiError
   */
  public static helpSendCreate(
    requestBody: Array<HelpCreate>,
  ): CancelablePromise<Array<ObservationRetrieve>> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/help/send/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Get Received Help Requests
   *
   * Retrieves all help requests received by the authenticated Provider from linked Persons only.
   *
   * **Security Features:**
   * - Provider authentication required
   * - Returns only help requests directed to this Provider
   * - Includes only requests from linked Persons
   * - Cannot access other providers' help requests
   *
   * **Help Request Retrieval:**
   * - Returns all help observations directed to this Provider
   * - Includes both ACTIVE and RESOLVED help requests
   * - Ordered by most recent first (latest observation_date)
   * - Includes complete help request details and Person information
   *
   * **Use Cases:**
   * - **Provider Dashboard**: Central view of all incoming help requests
   * - **Request Management**: Track and manage help request queue
   * - **Response Planning**: Prioritize and organize responses
   * - **Service History**: Review past help requests and resolutions
   *
   * @returns ObservationRetrieve
   * @throws ApiError
   */
  public static providerHelpList(): CancelablePromise<Array<ObservationRetrieve>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/provider/help/',
    });
  }
  /**
   * Get Active Help Count
   *
   * Returns the total count of active help requests for all persons linked to the authenticated provider.
   *
   * **Security Features:**
   * - Provider authentication required
   * - Counts only help requests from linked persons
   * - Filtered by authenticated provider only
   * - No access to other providers' help counts
   *
   * **Help Count Calculation:**
   * - Counts only ACTIVE help observations
   * - Includes help requests from all linked persons
   * - Filters by the specific provider ID
   * - Real-time count (not cached)
   *
   * **Use Cases:**
   * - **Dashboard Badge**: Show notification count in provider UI
   * - **Workload Management**: Track current help request volume
   * - **Priority Alerts**: Trigger notifications for high help counts
   * - **Performance Metrics**: Monitor help response patterns
   *
   * @returns HelpCount
   * @throws ApiError
   */
  public static providerHelpCountRetrieve(): CancelablePromise<HelpCount> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/provider/help-count/',
    });
  }
  /**
   * Mark Help Request as Resolved
   *
   * Updates a help request status from ACTIVE to RESOLVED with security validation.
   *
   * **Security Requirements:**
   * - Provider must be authenticated with valid Provider profile
   * - Help request must be directed to this Provider
   * - Help request must be from a linked Person
   * - Cannot resolve other providers' help requests
   *
   * **Resolution Process:**
   * 1. **Provider Verification**: Confirms user has valid Provider profile
   * 2. **Help Authorization**: Ensures help request belongs to this Provider
   * 3. **Relationship Validation**: Verifies help is from linked Person
   * 4. **Status Update**: Changes value_as_concept_id from ACTIVE to RESOLVED
   * 5. **Audit Logging**: Records resolution action with full context
   *
   * **Business Rules:**
   * - Only ACTIVE help requests can be resolved
   * - Provider must be the original recipient of the help request
   * - Help request must be from a linked Person
   * - Resolution action is permanent (cannot be undone via API)
   *
   * @param helpId
   * @returns ObservationRetrieve
   * @throws ApiError
   */
  public static providerHelpResolveCreate(helpId: number): CancelablePromise<ObservationRetrieve> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/provider/help/{help_id}/resolve/',
      path: {
        help_id: helpId,
      },
    });
  }
}
