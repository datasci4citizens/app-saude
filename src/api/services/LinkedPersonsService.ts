/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmergencyCount } from "../models/EmergencyCount";
import type { NextVisit } from "../models/NextVisit";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class LinkedPersonsService {
  /**
   * Get the number of active emergencies for patients linked to the authenticated provider
   *
   * Returns:
   * Object with the count of active emergencies:
   * - emergency_count: number of active emergencies
   * @returns EmergencyCount
   * @throws ApiError
   */
  public static providerEmergencyCountRetrieve(): CancelablePromise<EmergencyCount> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/provider/emergency-count/",
    });
  }
  /**
   * Get the next scheduled visit for the authenticated provider
   *
   * Returns:
   * Object with details about the next visit:
   * - next_visit: Object containing:
   * - person_name: Patient name
   * - visit_date: Date and time of the appointment
   * @returns NextVisit
   * @throws ApiError
   */
  public static providerNextVisitRetrieve(): CancelablePromise<NextVisit> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/provider/next-visit/",
    });
  }
}
