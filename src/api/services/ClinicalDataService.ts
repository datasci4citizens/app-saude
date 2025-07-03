/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DrugExposureCreate } from '../models/DrugExposureCreate';
import type { DrugExposureRetrieve } from '../models/DrugExposureRetrieve';
import type { DrugExposureUpdate } from '../models/DrugExposureUpdate';
import type { MeasurementCreate } from '../models/MeasurementCreate';
import type { MeasurementRetrieve } from '../models/MeasurementRetrieve';
import type { MeasurementUpdate } from '../models/MeasurementUpdate';
import type { ObservationCreate } from '../models/ObservationCreate';
import type { ObservationRetrieve } from '../models/ObservationRetrieve';
import type { ObservationUpdate } from '../models/ObservationUpdate';
import type { PatchedDrugExposureUpdate } from '../models/PatchedDrugExposureUpdate';
import type { PatchedMeasurementUpdate } from '../models/PatchedMeasurementUpdate';
import type { PatchedObservationUpdate } from '../models/PatchedObservationUpdate';
import type { PatchedVisitOccurrenceUpdate } from '../models/PatchedVisitOccurrenceUpdate';
import type { VisitOccurrenceCreate } from '../models/VisitOccurrenceCreate';
import type { VisitOccurrenceRetrieve } from '../models/VisitOccurrenceRetrieve';
import type { VisitOccurrenceUpdate } from '../models/VisitOccurrenceUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClinicalDataService {
  /**
   * Drug Exposure Management
   *
   * Manages records of drug/medication exposures and prescriptions.
   * Tracks medication history and drug-related events.
   * @returns DrugExposureRetrieve
   * @throws ApiError
   */
  public static apiDrugExposureList(): CancelablePromise<Array<DrugExposureRetrieve>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/drug-exposure/',
    });
  }
  /**
   * Drug Exposure Management
   *
   * Manages records of drug/medication exposures and prescriptions.
   * Tracks medication history and drug-related events.
   * @param requestBody
   * @returns DrugExposureCreate
   * @throws ApiError
   */
  public static apiDrugExposureCreate(
    requestBody?: DrugExposureCreate,
  ): CancelablePromise<DrugExposureCreate> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/drug-exposure/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Drug Exposure Management
   *
   * Manages records of drug/medication exposures and prescriptions.
   * Tracks medication history and drug-related events.
   * @param drugExposureId A unique integer value identifying this drug exposure.
   * @returns DrugExposureRetrieve
   * @throws ApiError
   */
  public static apiDrugExposureRetrieve(
    drugExposureId: number,
  ): CancelablePromise<DrugExposureRetrieve> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/drug-exposure/{drug_exposure_id}/',
      path: {
        drug_exposure_id: drugExposureId,
      },
    });
  }
  /**
   * Drug Exposure Management
   *
   * Manages records of drug/medication exposures and prescriptions.
   * Tracks medication history and drug-related events.
   * @param drugExposureId A unique integer value identifying this drug exposure.
   * @param requestBody
   * @returns DrugExposureUpdate
   * @throws ApiError
   */
  public static apiDrugExposureUpdate(
    drugExposureId: number,
    requestBody?: DrugExposureUpdate,
  ): CancelablePromise<DrugExposureUpdate> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/drug-exposure/{drug_exposure_id}/',
      path: {
        drug_exposure_id: drugExposureId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Drug Exposure Management
   *
   * Manages records of drug/medication exposures and prescriptions.
   * Tracks medication history and drug-related events.
   * @param drugExposureId A unique integer value identifying this drug exposure.
   * @param requestBody
   * @returns DrugExposureUpdate
   * @throws ApiError
   */
  public static apiDrugExposurePartialUpdate(
    drugExposureId: number,
    requestBody?: PatchedDrugExposureUpdate,
  ): CancelablePromise<DrugExposureUpdate> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/drug-exposure/{drug_exposure_id}/',
      path: {
        drug_exposure_id: drugExposureId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Drug Exposure Management
   *
   * Manages records of drug/medication exposures and prescriptions.
   * Tracks medication history and drug-related events.
   * @param drugExposureId A unique integer value identifying this drug exposure.
   * @returns void
   * @throws ApiError
   */
  public static apiDrugExposureDestroy(drugExposureId: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/drug-exposure/{drug_exposure_id}/',
      path: {
        drug_exposure_id: drugExposureId,
      },
    });
  }
  /**
   * Measurement Management
   *
   * Manages quantitative clinical measurements and test results.
   * Includes lab values, vital signs, and other measured clinical data.
   * @returns MeasurementRetrieve
   * @throws ApiError
   */
  public static apiMeasurementList(): CancelablePromise<Array<MeasurementRetrieve>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/measurement/',
    });
  }
  /**
   * Measurement Management
   *
   * Manages quantitative clinical measurements and test results.
   * Includes lab values, vital signs, and other measured clinical data.
   * @param requestBody
   * @returns MeasurementCreate
   * @throws ApiError
   */
  public static apiMeasurementCreate(
    requestBody?: MeasurementCreate,
  ): CancelablePromise<MeasurementCreate> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/measurement/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Measurement Management
   *
   * Manages quantitative clinical measurements and test results.
   * Includes lab values, vital signs, and other measured clinical data.
   * @param measurementId A unique integer value identifying this measurement.
   * @returns MeasurementRetrieve
   * @throws ApiError
   */
  public static apiMeasurementRetrieve(
    measurementId: number,
  ): CancelablePromise<MeasurementRetrieve> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/measurement/{measurement_id}/',
      path: {
        measurement_id: measurementId,
      },
    });
  }
  /**
   * Measurement Management
   *
   * Manages quantitative clinical measurements and test results.
   * Includes lab values, vital signs, and other measured clinical data.
   * @param measurementId A unique integer value identifying this measurement.
   * @param requestBody
   * @returns MeasurementUpdate
   * @throws ApiError
   */
  public static apiMeasurementUpdate(
    measurementId: number,
    requestBody?: MeasurementUpdate,
  ): CancelablePromise<MeasurementUpdate> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/measurement/{measurement_id}/',
      path: {
        measurement_id: measurementId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Measurement Management
   *
   * Manages quantitative clinical measurements and test results.
   * Includes lab values, vital signs, and other measured clinical data.
   * @param measurementId A unique integer value identifying this measurement.
   * @param requestBody
   * @returns MeasurementUpdate
   * @throws ApiError
   */
  public static apiMeasurementPartialUpdate(
    measurementId: number,
    requestBody?: PatchedMeasurementUpdate,
  ): CancelablePromise<MeasurementUpdate> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/measurement/{measurement_id}/',
      path: {
        measurement_id: measurementId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Measurement Management
   *
   * Manages quantitative clinical measurements and test results.
   * Includes lab values, vital signs, and other measured clinical data.
   * @param measurementId A unique integer value identifying this measurement.
   * @returns void
   * @throws ApiError
   */
  public static apiMeasurementDestroy(measurementId: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/measurement/{measurement_id}/',
      path: {
        measurement_id: measurementId,
      },
    });
  }
  /**
   * Observation Management
   *
   * Manages clinical observations, assessments, and findings.
   * Includes vital signs, symptoms, and other observed clinical data.
   * @returns ObservationRetrieve
   * @throws ApiError
   */
  public static apiObservationList(): CancelablePromise<Array<ObservationRetrieve>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/observation/',
    });
  }
  /**
   * Observation Management
   *
   * Manages clinical observations, assessments, and findings.
   * Includes vital signs, symptoms, and other observed clinical data.
   * @param requestBody
   * @returns ObservationCreate
   * @throws ApiError
   */
  public static apiObservationCreate(
    requestBody?: ObservationCreate,
  ): CancelablePromise<ObservationCreate> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/observation/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Observation Management
   *
   * Manages clinical observations, assessments, and findings.
   * Includes vital signs, symptoms, and other observed clinical data.
   * @param observationId A unique integer value identifying this observation.
   * @returns ObservationRetrieve
   * @throws ApiError
   */
  public static apiObservationRetrieve(
    observationId: number,
  ): CancelablePromise<ObservationRetrieve> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/observation/{observation_id}/',
      path: {
        observation_id: observationId,
      },
    });
  }
  /**
   * Observation Management
   *
   * Manages clinical observations, assessments, and findings.
   * Includes vital signs, symptoms, and other observed clinical data.
   * @param observationId A unique integer value identifying this observation.
   * @param requestBody
   * @returns ObservationUpdate
   * @throws ApiError
   */
  public static apiObservationUpdate(
    observationId: number,
    requestBody?: ObservationUpdate,
  ): CancelablePromise<ObservationUpdate> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/observation/{observation_id}/',
      path: {
        observation_id: observationId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Observation Management
   *
   * Manages clinical observations, assessments, and findings.
   * Includes vital signs, symptoms, and other observed clinical data.
   * @param observationId A unique integer value identifying this observation.
   * @param requestBody
   * @returns ObservationUpdate
   * @throws ApiError
   */
  public static apiObservationPartialUpdate(
    observationId: number,
    requestBody?: PatchedObservationUpdate,
  ): CancelablePromise<ObservationUpdate> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/observation/{observation_id}/',
      path: {
        observation_id: observationId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Observation Management
   *
   * Manages clinical observations, assessments, and findings.
   * Includes vital signs, symptoms, and other observed clinical data.
   * @param observationId A unique integer value identifying this observation.
   * @returns void
   * @throws ApiError
   */
  public static apiObservationDestroy(observationId: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/observation/{observation_id}/',
      path: {
        observation_id: observationId,
      },
    });
  }
  /**
   * Visit Occurrence Management
   *
   * Manages records of healthcare visits and encounters.
   * Tracks when and where patients receive care services.
   * @returns VisitOccurrenceRetrieve
   * @throws ApiError
   */
  public static apiVisitOccurrenceList(): CancelablePromise<Array<VisitOccurrenceRetrieve>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/visit-occurrence/',
    });
  }
  /**
   * Visit Occurrence Management
   *
   * Manages records of healthcare visits and encounters.
   * Tracks when and where patients receive care services.
   * @param requestBody
   * @returns VisitOccurrenceCreate
   * @throws ApiError
   */
  public static apiVisitOccurrenceCreate(
    requestBody?: VisitOccurrenceCreate,
  ): CancelablePromise<VisitOccurrenceCreate> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/visit-occurrence/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Visit Occurrence Management
   *
   * Manages records of healthcare visits and encounters.
   * Tracks when and where patients receive care services.
   * @param visitOccurrenceId A unique integer value identifying this visit occurrence.
   * @returns VisitOccurrenceRetrieve
   * @throws ApiError
   */
  public static apiVisitOccurrenceRetrieve(
    visitOccurrenceId: number,
  ): CancelablePromise<VisitOccurrenceRetrieve> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/visit-occurrence/{visit_occurrence_id}/',
      path: {
        visit_occurrence_id: visitOccurrenceId,
      },
    });
  }
  /**
   * Visit Occurrence Management
   *
   * Manages records of healthcare visits and encounters.
   * Tracks when and where patients receive care services.
   * @param visitOccurrenceId A unique integer value identifying this visit occurrence.
   * @param requestBody
   * @returns VisitOccurrenceUpdate
   * @throws ApiError
   */
  public static apiVisitOccurrenceUpdate(
    visitOccurrenceId: number,
    requestBody?: VisitOccurrenceUpdate,
  ): CancelablePromise<VisitOccurrenceUpdate> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/visit-occurrence/{visit_occurrence_id}/',
      path: {
        visit_occurrence_id: visitOccurrenceId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Visit Occurrence Management
   *
   * Manages records of healthcare visits and encounters.
   * Tracks when and where patients receive care services.
   * @param visitOccurrenceId A unique integer value identifying this visit occurrence.
   * @param requestBody
   * @returns VisitOccurrenceUpdate
   * @throws ApiError
   */
  public static apiVisitOccurrencePartialUpdate(
    visitOccurrenceId: number,
    requestBody?: PatchedVisitOccurrenceUpdate,
  ): CancelablePromise<VisitOccurrenceUpdate> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/visit-occurrence/{visit_occurrence_id}/',
      path: {
        visit_occurrence_id: visitOccurrenceId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Visit Occurrence Management
   *
   * Manages records of healthcare visits and encounters.
   * Tracks when and where patients receive care services.
   * @param visitOccurrenceId A unique integer value identifying this visit occurrence.
   * @returns void
   * @throws ApiError
   */
  public static apiVisitOccurrenceDestroy(visitOccurrenceId: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/visit-occurrence/{visit_occurrence_id}/',
      path: {
        visit_occurrence_id: visitOccurrenceId,
      },
    });
  }
}
