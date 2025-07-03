/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Auth } from '../models/Auth';
import type { AuthTokenResponse } from '../models/AuthTokenResponse';
import type { Logout } from '../models/Logout';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
  /**
   * Google OAuth2 Login
   *
   * Authenticates a user using Google OAuth2 access token.
   *
   * **Flow:**
   * 1. Client obtains Google OAuth2 token from Google
   * 2. Client sends token to this endpoint
   * 3. Server validates token with Google
   * 4. Server creates user if first time login
   * 5. Server returns JWT tokens and user profile data
   *
   * **User Creation:**
   * - New users are automatically created on first login
   * - User data is fetched from Google profile
   * - Existing users have their profile updated with latest Google data
   *
   * **Role Detection:**
   * The system automatically detects if the user is registered as:
   * - Provider: Service provider in the platform
   * - Person: Regular user/customer
   * - None: New user not yet assigned a role
   *
   * @param requestBody
   * @returns AuthTokenResponse
   * @throws ApiError
   */
  public static authLoginGoogleCreate(requestBody?: Auth): CancelablePromise<AuthTokenResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/login/google/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * User Logout
   *
   * Logs out the authenticated user by blacklisting their refresh token.
   *
   * **Process:**
   * 1. Client sends refresh token to be invalidated
   * 2. Server blacklists the token (if blacklisting is enabled)
   * 3. Server returns success confirmation
   *
   * **Security Notes:**
   * - Blacklisted tokens cannot be used to generate new access tokens
   * - Access tokens remain valid until they expire naturally
   * - For complete security, clients should also clear stored tokens
   *
   * **Token Blacklisting:**
   * This endpoint requires django-rest-framework-simplejwt token blacklisting to be enabled.
   * If not enabled, returns 501 Not Implemented.
   *
   * @param requestBody
   * @returns any
   * @throws ApiError
   */
  public static authLogoutCreate(requestBody: Logout): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/logout/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
