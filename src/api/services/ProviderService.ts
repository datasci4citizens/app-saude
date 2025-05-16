/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedProviderUpdate } from "../models/PatchedProviderUpdate";
import type { ProviderCreate } from "../models/ProviderCreate";
import type { ProviderRetrieve } from "../models/ProviderRetrieve";
import type { ProviderUpdate } from "../models/ProviderUpdate";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ProviderService {
  /**
   * @param birthDatetime
   * @param careSite
   * @param createdAt
   * @param ordering Which field to use when ordering the results.
   * @param professionalRegistration
   * @param search A search term.
   * @param socialName
   * @param specialtyConcept
   * @param updatedAt
   * @param user
   * @returns ProviderRetrieve
   * @throws ApiError
   */
  public static apiProviderList(
    birthDatetime?: string,
    careSite?: number,
    createdAt?: string,
    ordering?: string,
    professionalRegistration?: number,
    search?: string,
    socialName?: string,
    specialtyConcept?: number,
    updatedAt?: string,
    user?: number,
  ): CancelablePromise<Array<ProviderRetrieve>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/provider/",
      query: {
        birth_datetime: birthDatetime,
        care_site: careSite,
        created_at: createdAt,
        ordering: ordering,
        professional_registration: professionalRegistration,
        search: search,
        social_name: socialName,
        specialty_concept: specialtyConcept,
        updated_at: updatedAt,
        user: user,
      },
    });
  }
  /**
   * @param requestBody
   * @returns ProviderCreate
   * @throws ApiError
   */
  public static apiProviderCreate(
    requestBody?: ProviderCreate,
  ): CancelablePromise<ProviderCreate> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/provider/",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param providerId A unique integer value identifying this provider.
   * @returns ProviderRetrieve
   * @throws ApiError
   */
  public static apiProviderRetrieve(
    providerId: number,
  ): CancelablePromise<ProviderRetrieve> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/provider/{provider_id}/",
      path: {
        provider_id: providerId,
      },
    });
  }
  /**
   * @param providerId A unique integer value identifying this provider.
   * @param requestBody
   * @returns ProviderUpdate
   * @throws ApiError
   */
  public static apiProviderUpdate(
    providerId: number,
    requestBody?: ProviderUpdate,
  ): CancelablePromise<ProviderUpdate> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/provider/{provider_id}/",
      path: {
        provider_id: providerId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param providerId A unique integer value identifying this provider.
   * @param requestBody
   * @returns ProviderUpdate
   * @throws ApiError
   */
  public static apiProviderPartialUpdate(
    providerId: number,
    requestBody?: PatchedProviderUpdate,
  ): CancelablePromise<ProviderUpdate> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/provider/{provider_id}/",
      path: {
        provider_id: providerId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param providerId A unique integer value identifying this provider.
   * @returns void
   * @throws ApiError
   */
  public static apiProviderDestroy(
    providerId: number,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/provider/{provider_id}/",
      path: {
        provider_id: providerId,
      },
    });
  }
  /**
   * Função para obter todos os pacientes vinculados ao médico (provider) autenticado
   *
   * Returns:
   * lista de dicionários com os dados de cada paciente:
   * - person_id: ID do paciente
   * - name: Nome do paciente (social_name ou nome do usuário)
   * - age: Idade calculada com base na data de nascimento ou ano de nascimento
   * - last_visit_date: Data da última consulta com este provider
   * - last_visit_notes: Notas da última consulta com este provider
   * - last_emergency_date: Data da última emergência registrada
   * @param providerId
   * @returns any No response body
   * @throws ApiError
   */
  public static providerPersonsRetrieve2(
    providerId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/provider/{provider_id}/persons/",
      path: {
        provider_id: providerId,
      },
    });
  }
  /**
   * Função para obter o número de emergências ativas para os pacientes vinculados ao provider autenticado
   *
   * Returns:
   * objeto com a contagem de emergências ativas:
   * - emergency_count: número de emergências ativas
   * @returns any No response body
   * @throws ApiError
   */
  public static providerEmergencyCountRetrieve(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/provider/emergency-count/",
    });
  }
  /**
   * Função para obter a próxima visita agendada para o provider autenticado
   *
   * Returns:
   * objeto com informações sobre a próxima visita:
   * - person_name: Nome do paciente
   * - visit_date: Data e horário da consulta
   * @returns any No response body
   * @throws ApiError
   */
  public static providerNextVisitRetrieve(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/provider/next-visit/",
    });
  }
  /**
   * @param patientId
   * @returns any No response body
   * @throws ApiError
   */
  public static providerPatientsDiariesRetrieve(
    patientId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/provider/patients/{patient_id}/diaries/",
      path: {
        patient_id: patientId,
      },
    });
  }
  /**
   * @param diaryId
   * @param patientId
   * @returns any No response body
   * @throws ApiError
   */
  public static providerPatientsDiariesRetrieve2(
    diaryId: string,
    patientId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/provider/patients/{patient_id}/diaries/{diary_id}/",
      path: {
        diary_id: diaryId,
        patient_id: patientId,
      },
    });
  }
  /**
   * Função para obter todos os pacientes vinculados ao médico (provider) autenticado
   *
   * Returns:
   * lista de dicionários com os dados de cada paciente:
   * - person_id: ID do paciente
   * - name: Nome do paciente (social_name ou nome do usuário)
   * - age: Idade calculada com base na data de nascimento ou ano de nascimento
   * - last_visit_date: Data da última consulta com este provider
   * - last_visit_notes: Notas da última consulta com este provider
   * - last_emergency_date: Data da última emergência registrada
   * @returns any No response body
   * @throws ApiError
   */
  public static providerPersonsRetrieve(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/provider/persons/",
    });
  }
}
