/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Logout } from "../models/Logout";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class LogoutService {
  /**
   * View to logout the user.
   * Removes the refresh token and returns a success response.
   * @param requestBody
   * @returns any No response body
   * @throws ApiError
   */
  public static authLogoutCreate(requestBody: Logout): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/auth/logout/",
      body: requestBody,
      mediaType: "application/json",
    });
  }
}
