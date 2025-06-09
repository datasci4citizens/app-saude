/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HelpCount } from '../models/HelpCount';
import type { HelpCreate } from '../models/HelpCreate';
import type { ObservationRetrieve } from '../models/ObservationRetrieve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HelpService {
    /**
     * @param requestBody
     * @returns ObservationRetrieve
     * @throws ApiError
     */
    public static helpSendCreate(
        requestBody: Array<HelpCreate>,
    ): CancelablePromise<Array<ObservationRetrieve>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/help/send/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ObservationRetrieve
     * @throws ApiError
     */
    public static providerHelpList(): CancelablePromise<Array<ObservationRetrieve>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/provider/help/',
        });
    }
    /**
     * This endpoint counts the number of active helps (observations) for all patients linked to the provider.
     *
     * Returns:
     * Object with the count of active helps:
     * - help_count: number of active helps
     * @returns HelpCount
     * @throws ApiError
     */
    public static providerHelpCountRetrieve(): CancelablePromise<HelpCount> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/provider/help-count/',
        });
    }
}
