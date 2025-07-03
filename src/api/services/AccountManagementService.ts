/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountManagementService {
  /**
   * Toggle Dark Mode Setting
   *
   * Toggles the dark mode preference for the authenticated user.
   *
   * **Functionality:**
   * - Switches between light mode (false) and dark mode (true)
   * - Setting is automatically saved to user's profile
   * - Works for both Provider and Person user types
   * - Returns HTTP 200 on successful toggle
   *
   * **User Type Support:**
   * - **Person**: Toggles `use_dark_mode` field in Person profile
   * - **Provider**: Toggles `use_dark_mode` field in Provider profile
   * - **Standard User**: No-op (returns 200 but no change made)
   *
   * **Use Cases:**
   * - User interface theme switching
   * - Accessibility preferences
   * - Personal customization settings
   * - Mobile app theme synchronization
   *
   * **Behavior:**
   * - If current setting is `false` (light mode) → changes to `true` (dark mode)
   * - If current setting is `true` (dark mode) → changes to `false` (light mode)
   * - Setting persists across user sessions
   * - Immediate effect - no page refresh required
   *
   * **Frontend Integration:**
   * After calling this endpoint, frontend should:
   * 1. Immediately update UI theme
   * 2. Store new preference locally for faster loading
   * 3. Handle any theme-dependent components
   *
   * @returns any
   * @throws ApiError
   */
  public static accountThemeCreate(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/account/theme',
    });
  }
  /**
   * Get User Account Information
   *
   * Retrieves complete account information for the authenticated user.
   *
   * **Supported User Types:**
   * - **Provider**: Service providers on the platform
   * - **Person**: Regular users/customers
   * - **Standard User**: Users without specific roles
   *
   * **Returned Information:**
   * - Basic user profile data (name, email, username)
   * - Role-specific information when applicable
   * - Account settings and preferences
   * - Profile completion status
   *
   * **Use Cases:**
   * - Loading user profile pages
   * - Populating account settings forms
   * - Displaying user information in navigation
   * - Account verification processes
   *
   * @returns any
   * @throws ApiError
   */
  public static accountsRetrieve(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/accounts/',
    });
  }
  /**
   * Delete User Account
   *
   * Permanently deletes the authenticated user's account and all associated data.
   *
   * **⚠️ CRITICAL OPERATION - IRREVERSIBLE ⚠️**
   *
   * **Deletion Process:**
   * 1. **Data Cleanup**: Removes all fact relationships and associated data
   * 2. **Soft Delete**: Account is deactivated and marked as deleted
   * 3. **Data Anonymization**: Email and username are anonymized for audit purposes
   * 4. **Atomic Operation**: All changes happen in a single database transaction
   *
   * **What Gets Deleted:**
   * - All fact relationships where user is involved
   * - User profile data (Provider or Person)
   * - Account preferences and settings
   * - Authentication tokens (user becomes unable to login)
   *
   * **What Gets Preserved:**
   * - Anonymized user record for audit purposes
   * - System logs and audit trails
   * - Aggregated analytics data (non-personally identifiable)
   *
   * **User Types Supported:**
   * - **Provider**: Service provider accounts with all associated services
   * - **Person**: Regular user accounts with all personal data
   * - **Standard User**: Basic accounts without specific roles
   *
   * **Security Features:**
   * - Requires user authentication
   * - Full audit logging with IP tracking
   * - Atomic transaction ensures data consistency
   * - Cannot be undone once completed
   *
   * **Post-Deletion:**
   * - User will be immediately logged out
   * - All future login attempts will fail
   * - Account cannot be recovered
   *
   * @returns void
   * @throws ApiError
   */
  public static accountsDestroy(): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/accounts/',
    });
  }
}
