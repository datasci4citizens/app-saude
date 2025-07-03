/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DevelopmentToolsService {
  /**
   * Development Login as Person
   *
   * **🚨 DEVELOPMENT ONLY - NOT AVAILABLE IN PRODUCTION 🚨**
   *
   * Quick authentication endpoint for development and testing purposes.
   *
   * **Development Purpose:**
   * - Rapid testing of Person-specific features
   * - UI/UX development without manual login
   * - Integration testing and debugging
   * - Demo and presentation purposes
   *
   * **Security Notice:**
   * - Only works when DEBUG=True in Django settings
   * - Returns 403 Forbidden in production environments
   * - Uses hardcoded mock person account
   * - Should never be deployed to production
   *
   * **Mock Account Details:**
   * - Email: mock-person@email.com
   * - Role: Person
   * - Has complete person profile for testing
   *
   * **Returns:**
   * - JWT access token (short-lived)
   * - JWT refresh token (for token renewal)
   * - Same token format as production login endpoints
   *
   * @returns any
   * @throws ApiError
   */
  public static devLoginAsPersonCreate(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/dev-login-as-person/',
    });
  }
  /**
   * Development Login as Provider
   *
   * **🚨 DEVELOPMENT ONLY - NOT AVAILABLE IN PRODUCTION 🚨**
   *
   * Quick authentication endpoint for development and testing purposes.
   *
   * **Development Purpose:**
   * - Rapid testing of Provider-specific features
   * - UI/UX development without manual login
   * - Integration testing and debugging
   * - Demo and presentation purposes
   *
   * **Security Notice:**
   * - Only works when DEBUG=True in Django settings
   * - Returns 403 Forbidden in production environments
   * - Uses hardcoded mock provider account
   * - Should never be deployed to production
   *
   * **Mock Account Details:**
   * - Email: mock-provider@email.com
   * - Role: Provider
   * - Has complete provider profile for testing
   *
   * **Returns:**
   * - JWT access token (short-lived)
   * - JWT refresh token (for token renewal)
   * - Same token format as production login endpoints
   *
   * @returns any
   * @throws ApiError
   */
  public static devLoginAsProviderCreate(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/dev-login-as-provider/',
    });
  }
}
