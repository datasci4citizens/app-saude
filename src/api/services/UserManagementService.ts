/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserManagementService {
  /**
   * Get User Role and Profile Information
   *
   * Identifies the authenticated user's role and returns relevant profile information.
   *
   * **Role Detection Logic:**
   * 1. **Person Check**: First checks if user has a Person profile
   * 2. **Provider Check**: If not Person, checks if user has Provider profile
   * 3. **No Profile**: If neither exists, returns 404
   *
   * **Response Patterns:**
   * - **Person User**: Returns `{"person_id": "PERS123456"}`
   * - **Provider User**: Returns `{"provider_id": "PROV789012"}`
   * - **No Profile**: Returns 404 with error message
   *
   * **Use Cases:**
   * - Application initialization and routing
   * - Determining user capabilities and permissions
   * - Conditional UI rendering based on user type
   * - Navigation menu customization
   * - Feature access control
   *
   * **Frontend Integration:**
   * ```javascript
   * // Example usage in frontend
   * const roleResponse = await api.get('/user-role/');
   *
   * if (roleResponse.person_id) {
   * // User is a Person - show person features
   * navigateTo('/person-dashboard');
   * } else if (roleResponse.provider_id) {
   * // User is a Provider - show provider features
   * navigateTo('/provider-dashboard');
   * } else {
   * // User has no profile - show onboarding
   * navigateTo('/choose-profile-type');
   * }
   * ```
   *
   * **Security Notes:**
   * - Only returns profile ID for the authenticated user
   * - Cannot be used to lookup other users' profiles
   * - Profile IDs are safe to expose in frontend applications
   *
   * @returns any
   * @throws ApiError
   */
  public static apiUserEntityRetrieve(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/user-entity/',
    });
  }
}
