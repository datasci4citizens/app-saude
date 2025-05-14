/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ObservationCreate } from '../models/ObservationCreate';
import type { ObservationRetrieve } from '../models/ObservationRetrieve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EmergencyService {
    /**
     * @param requestBody
     * @returns ObservationRetrieve
     * @throws ApiError
     */
    public static emergencySendCreate(
        requestBody: Array<ObservationCreate>,
    ): CancelablePromise<Array<ObservationRetrieve>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/emergency/send/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
