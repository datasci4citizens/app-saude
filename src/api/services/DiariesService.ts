/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DiaryCreate } from "../models/DiaryCreate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class DiariesService {
  /**
   * @returns any No response body
   * @throws ApiError
   */
  public static diariesRetrieve(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/diaries/",
    });
  }
  /**
   * Cria um novo diário para o usuário logado
   * @param requestBody
   * @returns any
   * @throws ApiError
   */
  public static diariesCreate(
    requestBody: DiaryCreate,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/diaries/",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param diaryId
   * @returns any No response body
   * @throws ApiError
   */
  public static diariesRetrieve2(diaryId: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/diaries/{diary_id}/",
      path: {
        diary_id: diaryId,
      },
    });
  }
}
