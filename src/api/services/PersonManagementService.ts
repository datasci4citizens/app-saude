/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedPersonUpdate } from '../models/PatchedPersonUpdate';
import type { PersonCreate } from '../models/PersonCreate';
import type { PersonRetrieve } from '../models/PersonRetrieve';
import type { PersonUpdate } from '../models/PersonUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PersonManagementService {
  /**
   * Person Profile Management
   *
   * Manages Person profiles in the system. Persons are regular users/customers
   * who can receive services from Providers.
   *
   * **Key Features:**
   * - Profile creation and management
   * - Search by social name
   * - Full CRUD operations
   * - Duplicate registration prevention
   * @param birthDatetime
   * @param createdAt
   * @param ethnicityConcept
   * @param genderConcept
   * @param location
   * @param ordering Which field to use when ordering the results.
   * @param profilePicture
   * @param raceConcept
   * @param search A search term.
   * @param socialName
   * @param updatedAt
   * @param useDarkMode
   * @param user
   * @param yearOfBirth
   * @returns PersonRetrieve
   * @throws ApiError
   */
  public static apiPersonList(
    birthDatetime?: string,
    createdAt?: string,
    ethnicityConcept?: number,
    genderConcept?: number,
    location?: number,
    ordering?: string,
    profilePicture?: string,
    raceConcept?: number,
    search?: string,
    socialName?: string,
    updatedAt?: string,
    useDarkMode?: boolean,
    user?: number,
    yearOfBirth?: number,
  ): CancelablePromise<Array<PersonRetrieve>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/person/',
      query: {
        birth_datetime: birthDatetime,
        created_at: createdAt,
        ethnicity_concept: ethnicityConcept,
        gender_concept: genderConcept,
        location: location,
        ordering: ordering,
        profile_picture: profilePicture,
        race_concept: raceConcept,
        search: search,
        social_name: socialName,
        updated_at: updatedAt,
        use_dark_mode: useDarkMode,
        user: user,
        year_of_birth: yearOfBirth,
      },
    });
  }
  /**
   * Create Person Profile
   *
   * Creates a new Person profile for the authenticated user.
   *
   * **Business Rules:**
   * - Each user can only have ONE Person profile
   * - User cannot have both Person and Provider profiles simultaneously
   * - All required fields must be provided during creation
   * - Social name is used for search and display purposes
   *
   * **Profile Creation Process:**
   * 1. Validates user doesn't already have a Person profile
   * 2. Creates Person record linked to authenticated user
   * 3. Generates unique person_id for the profile
   * 4. Sets initial preferences (dark mode, etc.)
   *
   * **Use Cases:**
   * - New user registration as a service consumer
   * - Customer onboarding process
   * - Profile setup for receiving services
   *
   * **Important Notes:**
   * - This action cannot be undone easily (requires account deletion)
   * - User will be able to receive services after profile creation
   * - Profile information is used for service matching and communication
   *
   * @param requestBody
   * @returns any
   * @throws ApiError
   */
  public static apiPersonCreate(requestBody?: PersonCreate): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/person/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Person Profile Management
   *
   * Manages Person profiles in the system. Persons are regular users/customers
   * who can receive services from Providers.
   *
   * **Key Features:**
   * - Profile creation and management
   * - Search by social name
   * - Full CRUD operations
   * - Duplicate registration prevention
   * @param personId A unique integer value identifying this person.
   * @returns PersonRetrieve
   * @throws ApiError
   */
  public static apiPersonRetrieve(personId: number): CancelablePromise<PersonRetrieve> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/person/{person_id}/',
      path: {
        person_id: personId,
      },
    });
  }
  /**
   * Person Profile Management
   *
   * Manages Person profiles in the system. Persons are regular users/customers
   * who can receive services from Providers.
   *
   * **Key Features:**
   * - Profile creation and management
   * - Search by social name
   * - Full CRUD operations
   * - Duplicate registration prevention
   * @param personId A unique integer value identifying this person.
   * @param requestBody
   * @returns PersonUpdate
   * @throws ApiError
   */
  public static apiPersonUpdate(
    personId: number,
    requestBody?: PersonUpdate,
  ): CancelablePromise<PersonUpdate> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/person/{person_id}/',
      path: {
        person_id: personId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Person Profile Management
   *
   * Manages Person profiles in the system. Persons are regular users/customers
   * who can receive services from Providers.
   *
   * **Key Features:**
   * - Profile creation and management
   * - Search by social name
   * - Full CRUD operations
   * - Duplicate registration prevention
   * @param personId A unique integer value identifying this person.
   * @param requestBody
   * @returns PersonUpdate
   * @throws ApiError
   */
  public static apiPersonPartialUpdate(
    personId: number,
    requestBody?: PatchedPersonUpdate,
  ): CancelablePromise<PersonUpdate> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/person/{person_id}/',
      path: {
        person_id: personId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Person Profile Management
   *
   * Manages Person profiles in the system. Persons are regular users/customers
   * who can receive services from Providers.
   *
   * **Key Features:**
   * - Profile creation and management
   * - Search by social name
   * - Full CRUD operations
   * - Duplicate registration prevention
   * @param personId A unique integer value identifying this person.
   * @returns void
   * @throws ApiError
   */
  public static apiPersonDestroy(personId: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/person/{person_id}/',
      path: {
        person_id: personId,
      },
    });
  }
}
