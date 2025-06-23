/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DiaryCreate } from '../models/DiaryCreate';
import type { DiaryRetrieve } from '../models/DiaryRetrieve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DiaryService {
    /**
     * @returns any No response body
     * @throws ApiError
     */
    public static diariesRetrieve(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/diaries/',
        });
    }
    /**
     * Create a new diary for the logged-in user
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static diariesCreate(
        requestBody: DiaryCreate,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/diaries/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param diaryId
     * @returns DiaryRetrieve
     * @throws ApiError
     */
    public static diariesRetrieve2(
        diaryId: string,
    ): CancelablePromise<DiaryRetrieve> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/diaries/{diary_id}/',
            path: {
                'diary_id': diaryId,
            },
        });
    }
    /**
     * @param diaryId ID of the diary to delete
     * @returns void
     * @throws ApiError
     */
    public static diariesDestroy(
        diaryId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/diaries/{diary_id}/',
            path: {
                'diary_id': diaryId,
            },
        });
    }
    /**
     * @returns DiaryRetrieve
     * @throws ApiError
     */
    public static personDiariesList(): CancelablePromise<Array<DiaryRetrieve>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/person/diaries/',
        });
    }
}
