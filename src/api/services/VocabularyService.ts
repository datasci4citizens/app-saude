/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedVocabulary } from '../models/PatchedVocabulary';
import type { Vocabulary } from '../models/Vocabulary';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VocabularyService {
    /**
     * @returns Vocabulary
     * @throws ApiError
     */
    public static apiVocabularyList(): CancelablePromise<Array<Vocabulary>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/vocabulary/',
        });
    }
    /**
     * @param requestBody
     * @returns Vocabulary
     * @throws ApiError
     */
    public static apiVocabularyCreate(
        requestBody?: Vocabulary,
    ): CancelablePromise<Vocabulary> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/vocabulary/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param vocabularyId A unique value identifying this vocabulary.
     * @returns Vocabulary
     * @throws ApiError
     */
    public static apiVocabularyRetrieve(
        vocabularyId: string,
    ): CancelablePromise<Vocabulary> {
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
     * @returns Vocabulary
     * @throws ApiError
     */
    public static apiVocabularyUpdate(
        vocabularyId: string,
        requestBody?: Vocabulary,
    ): CancelablePromise<Vocabulary> {
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
     * @returns Vocabulary
     * @throws ApiError
     */
    public static apiVocabularyPartialUpdate(
        vocabularyId: string,
        requestBody?: PatchedVocabulary,
    ): CancelablePromise<Vocabulary> {
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
