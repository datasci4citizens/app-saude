/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VisitManagementService {
  /**
   * Get Next Scheduled Visit
   *
   * **⚠️ LEGACY FEATURE - LIMITED FRONTEND SUPPORT ⚠️**
   *
   * Retrieves the next scheduled visit for the authenticated provider.
   *
   * **Feature Status:**
   * - **Backend**: Fully implemented and functional
   * - **Frontend**: Limited support, feature partially abandoned
   * - **Future**: Kept for potential reimplementation
   * - **Usage**: Mainly for API completeness and future development
   *
   * **Visit Scheduling Logic:**
   * - Finds next future visit (after current datetime)
   * - Filters by authenticated provider
   * - Returns earliest upcoming appointment
   * - Includes patient name and visit datetime
   *
   * **Patient Name Resolution:**
   * 1. **Primary**: Uses person.social_name if available
   * 2. **Fallback**: Combines first_name + last_name from user
   * 3. **Final Fallback**: Uses username if names not available
   *
   * **Use Cases (Future Implementation):**
   * - **Provider Dashboard**: Show next appointment
   * - **Calendar Integration**: Sync with external calendars
   * - **Notification System**: Appointment reminders
   * - **Schedule Management**: Provider schedule overview
   *
   * **Technical Notes:**
   * - Queries are optimized with proper filtering
   * - Handles edge cases (no upcoming visits)
   * - Returns null when no visits scheduled
   * - Timezone-aware date comparisons
   *
   * **For Future Teams:**
   * This endpoint is maintained for potential frontend reimplementation.
   * The backend logic is solid and can be leveraged when visit management
   * features are prioritized for frontend development.
   *
   * @returns any
   * @throws ApiError
   */
  public static providerNextVisitRetrieve(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/provider/next-visit/',
    });
  }
}
