/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedProviderUpdate } from '../models/PatchedProviderUpdate';
import type { ProviderCreate } from '../models/ProviderCreate';
import type { ProviderRetrieve } from '../models/ProviderRetrieve';
import type { ProviderUpdate } from '../models/ProviderUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProviderManagementService {
  /**
   * Provider Profile Management
   *
   * Manages Provider profiles in the system. Providers are service providers
   * who offer services to Persons in the platform.
   *
   * **Key Features:**
   * - Professional profile creation and management
   * - Search by social name and professional details
   * - Professional registration validation
   * - Service offering capabilities
   * @param birthDatetime
   * @param careSite
   * @param createdAt
   * @param ordering Which field to use when ordering the results.
   * @param professionalRegistration
   * @param profilePicture
   * @param search A search term.
   * @param socialName
   * @param specialtyConcept
   * @param updatedAt
   * @param useDarkMode
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
    profilePicture?: string,
    search?: string,
    socialName?: string,
    specialtyConcept?: number,
    updatedAt?: string,
    useDarkMode?: boolean,
    user?: number,
  ): CancelablePromise<Array<ProviderRetrieve>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/provider/',
      query: {
        birth_datetime: birthDatetime,
        care_site: careSite,
        created_at: createdAt,
        ordering: ordering,
        professional_registration: professionalRegistration,
        profile_picture: profilePicture,
        search: search,
        social_name: socialName,
        specialty_concept: specialtyConcept,
        updated_at: updatedAt,
        use_dark_mode: useDarkMode,
        user: user,
      },
    });
  }
  /**
   * Create Provider Profile
   *
   * Creates a new Provider profile for the authenticated user.
   *
   * **Business Rules:**
   * - Each user can only have ONE Provider profile
   * - User cannot have both Person and Provider profiles simultaneously
   * - Professional registration number must be unique (if provided)
   * - All required professional information must be provided
   *
   * **Provider Registration Process:**
   * 1. Validates user doesn't already have a Provider profile
   * 2. Validates professional credentials (if applicable)
   * 3. Creates Provider record with professional information
   * 4. Generates unique provider_id for the profile
   * 5. Sets up initial service offering capabilities
   *
   * **Use Cases:**
   * - Healthcare professional registration
   * - Service provider onboarding
   * - Professional practice setup
   * - Marketplace seller registration
   *
   * **Professional Information:**
   * - Professional registration number (for regulated professions)
   * - Specialty/area of expertise
   * - Professional certifications
   * - Service categories
   *
   * **Post-Creation:**
   * - Provider can start offering services
   * - Profile appears in provider searches
   * - Can receive service requests from Persons
   *
   * @param requestBody
   * @returns any
   * @throws ApiError
   */
  public static apiProviderCreate(requestBody?: ProviderCreate): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/provider/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Provider Profile Management
   *
   * Manages Provider profiles in the system. Providers are service providers
   * who offer services to Persons in the platform.
   *
   * **Key Features:**
   * - Professional profile creation and management
   * - Search by social name and professional details
   * - Professional registration validation
   * - Service offering capabilities
   * @param providerId A unique integer value identifying this provider.
   * @returns ProviderRetrieve
   * @throws ApiError
   */
  public static apiProviderRetrieve(providerId: number): CancelablePromise<ProviderRetrieve> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/provider/{provider_id}/',
      path: {
        provider_id: providerId,
      },
    });
  }
  /**
   * Provider Profile Management
   *
   * Manages Provider profiles in the system. Providers are service providers
   * who offer services to Persons in the platform.
   *
   * **Key Features:**
   * - Professional profile creation and management
   * - Search by social name and professional details
   * - Professional registration validation
   * - Service offering capabilities
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
      method: 'PUT',
      url: '/api/provider/{provider_id}/',
      path: {
        provider_id: providerId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Provider Profile Management
   *
   * Manages Provider profiles in the system. Providers are service providers
   * who offer services to Persons in the platform.
   *
   * **Key Features:**
   * - Professional profile creation and management
   * - Search by social name and professional details
   * - Professional registration validation
   * - Service offering capabilities
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
      method: 'PATCH',
      url: '/api/provider/{provider_id}/',
      path: {
        provider_id: providerId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Provider Profile Management
   *
   * Manages Provider profiles in the system. Providers are service providers
   * who offer services to Persons in the platform.
   *
   * **Key Features:**
   * - Professional profile creation and management
   * - Search by social name and professional details
   * - Professional registration validation
   * - Service offering capabilities
   * @param providerId A unique integer value identifying this provider.
   * @returns void
   * @throws ApiError
   */
  public static apiProviderDestroy(providerId: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/provider/{provider_id}/',
      path: {
        provider_id: providerId,
      },
    });
  }
}
