/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedVocabularyUpdate } from '../models/PatchedVocabularyUpdate';
import type { VocabularyCreate } from '../models/VocabularyCreate';
import type { VocabularyRetrieve } from '../models/VocabularyRetrieve';
import type { VocabularyUpdate } from '../models/VocabularyUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VocabularyService {
    /**
     * @returns VocabularyRetrieve
     * @throws ApiError
     */
    public static apiVocabularyList(): CancelablePromise<Array<VocabularyRetrieve>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/vocabulary/',
        });
    }
    /**
     * @param requestBody
     * @returns VocabularyCreate
     * @throws ApiError
     */
    public static apiVocabularyCreate(
        requestBody?: VocabularyCreate,
    ): CancelablePromise<VocabularyCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/vocabulary/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param vocabularyId A unique value identifying this vocabulary.
     * @returns VocabularyRetrieve
     * @throws ApiError
     */
    public static apiVocabularyRetrieve(
        vocabularyId: string,
    ): CancelablePromise<VocabularyRetrieve> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/vocabulary/{vocabulary_id}/',
            path: {
                'vocabulary_id': vocabularyId,
            },
        });
    }
    /**
     * @param vocabularyId A unique value identifying this vocabulary.
     * @param requestBody
     * @returns VocabularyUpdate
     * @throws ApiError
     */
    public static apiVocabularyUpdate(
        vocabularyId: string,
        requestBody: VocabularyUpdate,
    ): CancelablePromise<VocabularyUpdate> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/vocabulary/{vocabulary_id}/',
            path: {
                'vocabulary_id': vocabularyId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param vocabularyId A unique value identifying this vocabulary.
     * @param requestBody
     * @returns VocabularyUpdate
     * @throws ApiError
     */
    public static apiVocabularyPartialUpdate(
        vocabularyId: string,
        requestBody?: PatchedVocabularyUpdate,
    ): CancelablePromise<VocabularyUpdate> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/vocabulary/{vocabulary_id}/',
            path: {
                'vocabulary_id': vocabularyId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param vocabularyId A unique value identifying this vocabulary.
     * @returns void
     * @throws ApiError
     */
    public static apiVocabularyDestroy(
        vocabularyId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/vocabulary/{vocabulary_id}/',
            path: {
                'vocabulary_id': vocabularyId,
            },
        });
    }
}
