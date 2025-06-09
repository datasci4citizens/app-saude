/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
<<<<<<< Updated upstream
import type { UserRetrieve } from "../models/UserRetrieve";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AccountService {
  /**
   * ViewSet to manage user accounts.
   * Allowed HTTP methods: GET, DELETE.
   * @returns any No response body
   * @throws ApiError
   */
  public static apiAccountList(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/account/",
    });
  }
  /**
   * ViewSet to manage user accounts.
   * Allowed HTTP methods: GET, DELETE.
   * @param id A unique integer value identifying this user.
   * @returns UserRetrieve
   * @throws ApiError
   */
  public static apiAccountRetrieve(
    id: number,
  ): CancelablePromise<UserRetrieve> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/account/{id}/",
      path: {
        id: id,
      },
    });
  }
  /**
   * ViewSet to manage user accounts.
   * Allowed HTTP methods: GET, DELETE.
   * @param id A unique integer value identifying this user.
   * @returns void
   * @throws ApiError
   */
  public static apiAccountDestroy(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/account/{id}/",
      path: {
        id: id,
      },
    });
  }
=======
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountService {
    /**
     * ViewSet to manage user accounts.
     * Allowed HTTP methods: GET, DELETE.
     * @returns any No response body
     * @throws ApiError
     */
    public static accountsRetrieve(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/accounts/',
        });
    }
    /**
     * ViewSet to manage user accounts.
     * Allowed HTTP methods: GET, DELETE.
     * @returns void
     * @throws ApiError
     */
    public static accountsDestroy(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/accounts/',
        });
    }
>>>>>>> Stashed changes
}
