/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
    public static providerHelpCountList(): CancelablePromise<Array<ObservationRetrieve>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/provider/help-count/',
        });
    }
}
