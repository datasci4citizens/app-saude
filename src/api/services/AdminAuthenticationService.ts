/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminLogin } from '../models/AdminLogin';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminAuthenticationService {
  /**
   * Admin User Impersonation
   *
   * Allows administrators to obtain JWT tokens for any user in the system.
   *
   * **Use Cases:**
   * - Customer support requiring access to user accounts
   * - Testing user-specific features
   * - Administrative operations on behalf of users
   *
   * **Security Requirements:**
   * - Requires valid admin credentials (username + password)
   * - Admin user must have `is_staff = True`
   * - Target user must exist in the system
   *
   * **Process:**
   * 1. Admin provides their own username and password
   * 2. Admin specifies target user's email
   * 3. System validates admin credentials
   * 4. System returns JWT tokens for the target user
   *
   * **Important:** This endpoint should be used carefully and logged for security auditing.
   *
   * @param email Email of the target user to impersonate
   * @param password Admin password for authentication
   * @param username Admin username for authentication
   * @returns any
   * @throws ApiError
   */
  public static authLoginAdminRetrieve(
    email: string,
    password: string,
    username: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/auth/login/admin/',
      query: {
        email: email,
        password: password,
        username: username,
      },
    });
  }
  /**
   * Direct Admin Login
   *
   * Direct authentication endpoint for administrators.
   *
   * **Purpose:**
   * - Allows admin users to log into their own accounts
   * - Returns JWT tokens for the admin user themselves
   * - Used for admin panel access and administrative operations
   *
   * **Requirements:**
   * - Valid admin username and password
   * - Admin user must have `is_staff = True`
   *
   * **Response:**
   * Returns JWT tokens and basic admin user information.
   *
   * @param requestBody
   * @returns any
   * @throws ApiError
   */
  public static authLoginAdminCreate(requestBody: AdminLogin): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/login/admin/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
