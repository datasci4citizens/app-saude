/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TokenRefresh } from '../models/TokenRefresh';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
  /**
   * Takes a refresh type JSON web token and returns an access type JSON web
   * token if the refresh token is valid.
   * @param requestBody
   * @returns TokenRefresh
   * @throws ApiError
   */
  public static authTokenRefreshCreate(requestBody: TokenRefresh): CancelablePromise<TokenRefresh> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/token/refresh/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
