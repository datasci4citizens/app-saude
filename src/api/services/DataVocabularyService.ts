/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConceptClassCreate } from '../models/ConceptClassCreate';
import type { ConceptClassRetrieve } from '../models/ConceptClassRetrieve';
import type { ConceptClassUpdate } from '../models/ConceptClassUpdate';
import type { ConceptCreate } from '../models/ConceptCreate';
import type { ConceptRetrieve } from '../models/ConceptRetrieve';
import type { ConceptSynonymCreate } from '../models/ConceptSynonymCreate';
import type { ConceptSynonymRetrieve } from '../models/ConceptSynonymRetrieve';
import type { ConceptSynonymUpdate } from '../models/ConceptSynonymUpdate';
import type { ConceptUpdate } from '../models/ConceptUpdate';
import type { DomainCreate } from '../models/DomainCreate';
import type { DomainRetrieve } from '../models/DomainRetrieve';
import type { DomainUpdate } from '../models/DomainUpdate';
import type { PatchedConceptClassUpdate } from '../models/PatchedConceptClassUpdate';
import type { PatchedConceptSynonymUpdate } from '../models/PatchedConceptSynonymUpdate';
import type { PatchedConceptUpdate } from '../models/PatchedConceptUpdate';
import type { PatchedDomainUpdate } from '../models/PatchedDomainUpdate';
import type { PatchedVocabularyUpdate } from '../models/PatchedVocabularyUpdate';
import type { VocabularyCreate } from '../models/VocabularyCreate';
import type { VocabularyRetrieve } from '../models/VocabularyRetrieve';
import type { VocabularyUpdate } from '../models/VocabularyUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DataVocabularyService {
  /**
   * List Concepts with Advanced Filtering
   *
   * Retrieves concepts with optional filtering and relationship enrichment.
   *
   * **Filtering Options:**
   *
   * **By Class:** Use `class` parameter to filter by concept class IDs
   * - Single class: `?class=Gender`
   * - Multiple classes: `?class=Gender,Ethnicity,Condition`
   *
   * **By Code:** Use `code` parameter to filter by specific concept codes
   * - Single code: `?code=ACTIVE`
   * - Multiple codes: `?code=ACTIVE,RESOLVED,PENDING`
   *
   * **Language Support:** Use `lang` parameter for translations
   * - Portuguese (default): `?lang=297504001` or `?lang=pt`
   * - English: `?lang=en`
   * - Spanish: `?lang=es`
   *
   * **Relationship Enrichment:** Use `relationship` parameter to include related concepts
   * - Value types: `?relationship=has_value_type`
   * - Hierarchical: `?relationship=subsumes`
   *
   * **Combined Filtering:**
   * ```
   * ?class=Gender,Ethnicity&lang=pt&relationship=has_value_type
   * ```
   *
   * **Performance Notes:**
   * - Queries are optimized with strategic prefetching
   * - Large result sets are automatically paginated
   * - Translations are loaded efficiently in single queries
   *
   * **Use Cases:**
   * - Populating dropdown lists with standardized values
   * - Building medical terminology browsers
   * - Creating concept mapping interfaces
   * - Generating data entry forms with controlled vocabularies
   *
   * @param _class Filter by concept class IDs (comma-separated). Example: class=Gender,Ethnicity
   * @param code Filter by concept codes (comma-separated). Example: code=ACTIVE,RESOLVED
   * @param lang Language code for translations. Defaults to Portuguese (297504001). Example: lang=pt
   * @param relationship Include related concepts via specified relationship. Example: relationship=has_value_type
   * @returns ConceptRetrieve
   * @throws ApiError
   */
  public static apiConceptList(
    _class?: string,
    code?: string,
    lang?: string,
    relationship?: string,
  ): CancelablePromise<Array<ConceptRetrieve>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/concept/',
      query: {
        class: _class,
        code: code,
        lang: lang,
        relationship: relationship,
      },
    });
  }
  /**
   * Concept Management with Advanced Filtering
   *
   * Manages standardized concepts used throughout the healthcare/service system.
   * Supports multi-language translations and relationship-based queries.
   *
   * **Key Features:**
   * - Multi-language support with automatic translation loading
   * - Complex filtering by class, code, and relationships
   * - Relationship traversal for connected concepts
   * - Optimized queries with prefetching for performance
   * @param _class Filter by concept class IDs (comma-separated). Example: class=Gender,Ethnicity
   * @param code Filter by concept codes (comma-separated). Example: code=ACTIVE,RESOLVED
   * @param lang Language code for translations. Defaults to Portuguese (297504001). Example: lang=pt
   * @param relationship Include related concepts via specified relationship. Example: relationship=has_value_type
   * @param requestBody
   * @returns ConceptCreate
   * @throws ApiError
   */
  public static apiConceptCreate(
    _class?: string,
    code?: string,
    lang?: string,
    relationship?: string,
    requestBody?: ConceptCreate,
  ): CancelablePromise<ConceptCreate> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/concept/',
      query: {
        class: _class,
        code: code,
        lang: lang,
        relationship: relationship,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Concept Class Management
   *
   * Manages concept classes that categorize different types of concepts.
   * Used for organizing and filtering concepts by their classification.
   * @returns ConceptClassRetrieve
   * @throws ApiError
   */
  public static apiConceptClassList(): CancelablePromise<Array<ConceptClassRetrieve>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/concept-class/',
    });
  }
  /**
   * Concept Class Management
   *
   * Manages concept classes that categorize different types of concepts.
   * Used for organizing and filtering concepts by their classification.
   * @param requestBody
   * @returns ConceptClassCreate
   * @throws ApiError
   */
  public static apiConceptClassCreate(
    requestBody?: ConceptClassCreate,
  ): CancelablePromise<ConceptClassCreate> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/concept-class/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Concept Class Management
   *
   * Manages concept classes that categorize different types of concepts.
   * Used for organizing and filtering concepts by their classification.
   * @param conceptClassId A unique value identifying this concept class.
   * @returns ConceptClassRetrieve
   * @throws ApiError
   */
  public static apiConceptClassRetrieve(
    conceptClassId: string,
  ): CancelablePromise<ConceptClassRetrieve> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/concept-class/{concept_class_id}/',
      path: {
        concept_class_id: conceptClassId,
      },
    });
  }
  /**
   * Concept Class Management
   *
   * Manages concept classes that categorize different types of concepts.
   * Used for organizing and filtering concepts by their classification.
   * @param conceptClassId A unique value identifying this concept class.
   * @param requestBody
   * @returns ConceptClassUpdate
   * @throws ApiError
   */
  public static apiConceptClassUpdate(
    conceptClassId: string,
    requestBody: ConceptClassUpdate,
  ): CancelablePromise<ConceptClassUpdate> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/concept-class/{concept_class_id}/',
      path: {
        concept_class_id: conceptClassId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Concept Class Management
   *
   * Manages concept classes that categorize different types of concepts.
   * Used for organizing and filtering concepts by their classification.
   * @param conceptClassId A unique value identifying this concept class.
   * @param requestBody
   * @returns ConceptClassUpdate
   * @throws ApiError
   */
  public static apiConceptClassPartialUpdate(
    conceptClassId: string,
    requestBody?: PatchedConceptClassUpdate,
  ): CancelablePromise<ConceptClassUpdate> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/concept-class/{concept_class_id}/',
      path: {
        concept_class_id: conceptClassId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Concept Class Management
   *
   * Manages concept classes that categorize different types of concepts.
   * Used for organizing and filtering concepts by their classification.
   * @param conceptClassId A unique value identifying this concept class.
   * @returns void
   * @throws ApiError
   */
  public static apiConceptClassDestroy(conceptClassId: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/concept-class/{concept_class_id}/',
      path: {
        concept_class_id: conceptClassId,
      },
    });
  }
  /**
   * Concept Synonym Management
   *
   * Manages multilingual synonyms and translations for concepts.
   * Enables searching and displaying concepts in different languages.
   * @returns ConceptSynonymRetrieve
   * @throws ApiError
   */
  public static apiConceptSynonymList(): CancelablePromise<Array<ConceptSynonymRetrieve>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/concept-synonym/',
    });
  }
  /**
   * Concept Synonym Management
   *
   * Manages multilingual synonyms and translations for concepts.
   * Enables searching and displaying concepts in different languages.
   * @param requestBody
   * @returns ConceptSynonymCreate
   * @throws ApiError
   */
  public static apiConceptSynonymCreate(
    requestBody: ConceptSynonymCreate,
  ): CancelablePromise<ConceptSynonymCreate> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/concept-synonym/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Concept Synonym Management
   *
   * Manages multilingual synonyms and translations for concepts.
   * Enables searching and displaying concepts in different languages.
   * @param conceptSynonymId A unique integer value identifying this concept synonym.
   * @returns ConceptSynonymRetrieve
   * @throws ApiError
   */
  public static apiConceptSynonymRetrieve(
    conceptSynonymId: number,
  ): CancelablePromise<ConceptSynonymRetrieve> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/concept-synonym/{concept_synonym_id}/',
      path: {
        concept_synonym_id: conceptSynonymId,
      },
    });
  }
  /**
   * Concept Synonym Management
   *
   * Manages multilingual synonyms and translations for concepts.
   * Enables searching and displaying concepts in different languages.
   * @param conceptSynonymId A unique integer value identifying this concept synonym.
   * @param requestBody
   * @returns ConceptSynonymUpdate
   * @throws ApiError
   */
  public static apiConceptSynonymUpdate(
    conceptSynonymId: number,
    requestBody: ConceptSynonymUpdate,
  ): CancelablePromise<ConceptSynonymUpdate> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/concept-synonym/{concept_synonym_id}/',
      path: {
        concept_synonym_id: conceptSynonymId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Concept Synonym Management
   *
   * Manages multilingual synonyms and translations for concepts.
   * Enables searching and displaying concepts in different languages.
   * @param conceptSynonymId A unique integer value identifying this concept synonym.
   * @param requestBody
   * @returns ConceptSynonymUpdate
   * @throws ApiError
   */
  public static apiConceptSynonymPartialUpdate(
    conceptSynonymId: number,
    requestBody?: PatchedConceptSynonymUpdate,
  ): CancelablePromise<ConceptSynonymUpdate> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/concept-synonym/{concept_synonym_id}/',
      path: {
        concept_synonym_id: conceptSynonymId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Concept Synonym Management
   *
   * Manages multilingual synonyms and translations for concepts.
   * Enables searching and displaying concepts in different languages.
   * @param conceptSynonymId A unique integer value identifying this concept synonym.
   * @returns void
   * @throws ApiError
   */
  public static apiConceptSynonymDestroy(conceptSynonymId: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/concept-synonym/{concept_synonym_id}/',
      path: {
        concept_synonym_id: conceptSynonymId,
      },
    });
  }
  /**
   * Concept Management with Advanced Filtering
   *
   * Manages standardized concepts used throughout the healthcare/service system.
   * Supports multi-language translations and relationship-based queries.
   *
   * **Key Features:**
   * - Multi-language support with automatic translation loading
   * - Complex filtering by class, code, and relationships
   * - Relationship traversal for connected concepts
   * - Optimized queries with prefetching for performance
   * @param conceptId A unique integer value identifying this concept.
   * @param _class Filter by concept class IDs (comma-separated). Example: class=Gender,Ethnicity
   * @param code Filter by concept codes (comma-separated). Example: code=ACTIVE,RESOLVED
   * @param lang Language code for translations. Defaults to Portuguese (297504001). Example: lang=pt
   * @param relationship Include related concepts via specified relationship. Example: relationship=has_value_type
   * @returns ConceptRetrieve
   * @throws ApiError
   */
  public static apiConceptRetrieve(
    conceptId: number,
    _class?: string,
    code?: string,
    lang?: string,
    relationship?: string,
  ): CancelablePromise<ConceptRetrieve> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/concept/{concept_id}/',
      path: {
        concept_id: conceptId,
      },
      query: {
        class: _class,
        code: code,
        lang: lang,
        relationship: relationship,
      },
    });
  }
  /**
   * Concept Management with Advanced Filtering
   *
   * Manages standardized concepts used throughout the healthcare/service system.
   * Supports multi-language translations and relationship-based queries.
   *
   * **Key Features:**
   * - Multi-language support with automatic translation loading
   * - Complex filtering by class, code, and relationships
   * - Relationship traversal for connected concepts
   * - Optimized queries with prefetching for performance
   * @param conceptId A unique integer value identifying this concept.
   * @param _class Filter by concept class IDs (comma-separated). Example: class=Gender,Ethnicity
   * @param code Filter by concept codes (comma-separated). Example: code=ACTIVE,RESOLVED
   * @param lang Language code for translations. Defaults to Portuguese (297504001). Example: lang=pt
   * @param relationship Include related concepts via specified relationship. Example: relationship=has_value_type
   * @param requestBody
   * @returns ConceptUpdate
   * @throws ApiError
   */
  public static apiConceptUpdate(
    conceptId: number,
    _class?: string,
    code?: string,
    lang?: string,
    relationship?: string,
    requestBody?: ConceptUpdate,
  ): CancelablePromise<ConceptUpdate> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/concept/{concept_id}/',
      path: {
        concept_id: conceptId,
      },
      query: {
        class: _class,
        code: code,
        lang: lang,
        relationship: relationship,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Concept Management with Advanced Filtering
   *
   * Manages standardized concepts used throughout the healthcare/service system.
   * Supports multi-language translations and relationship-based queries.
   *
   * **Key Features:**
   * - Multi-language support with automatic translation loading
   * - Complex filtering by class, code, and relationships
   * - Relationship traversal for connected concepts
   * - Optimized queries with prefetching for performance
   * @param conceptId A unique integer value identifying this concept.
   * @param _class Filter by concept class IDs (comma-separated). Example: class=Gender,Ethnicity
   * @param code Filter by concept codes (comma-separated). Example: code=ACTIVE,RESOLVED
   * @param lang Language code for translations. Defaults to Portuguese (297504001). Example: lang=pt
   * @param relationship Include related concepts via specified relationship. Example: relationship=has_value_type
   * @param requestBody
   * @returns ConceptUpdate
   * @throws ApiError
   */
  public static apiConceptPartialUpdate(
    conceptId: number,
    _class?: string,
    code?: string,
    lang?: string,
    relationship?: string,
    requestBody?: PatchedConceptUpdate,
  ): CancelablePromise<ConceptUpdate> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/concept/{concept_id}/',
      path: {
        concept_id: conceptId,
      },
      query: {
        class: _class,
        code: code,
        lang: lang,
        relationship: relationship,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Concept Management with Advanced Filtering
   *
   * Manages standardized concepts used throughout the healthcare/service system.
   * Supports multi-language translations and relationship-based queries.
   *
   * **Key Features:**
   * - Multi-language support with automatic translation loading
   * - Complex filtering by class, code, and relationships
   * - Relationship traversal for connected concepts
   * - Optimized queries with prefetching for performance
   * @param conceptId A unique integer value identifying this concept.
   * @param _class Filter by concept class IDs (comma-separated). Example: class=Gender,Ethnicity
   * @param code Filter by concept codes (comma-separated). Example: code=ACTIVE,RESOLVED
   * @param lang Language code for translations. Defaults to Portuguese (297504001). Example: lang=pt
   * @param relationship Include related concepts via specified relationship. Example: relationship=has_value_type
   * @returns void
   * @throws ApiError
   */
  public static apiConceptDestroy(
    conceptId: number,
    _class?: string,
    code?: string,
    lang?: string,
    relationship?: string,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/concept/{concept_id}/',
      path: {
        concept_id: conceptId,
      },
      query: {
        class: _class,
        code: code,
        lang: lang,
        relationship: relationship,
      },
    });
  }
  /**
   * Domain Management
   *
   * Manages data domains that categorize different types of clinical/service data.
   * Domains help organize and validate data according to their clinical context.
   * @returns DomainRetrieve
   * @throws ApiError
   */
  public static apiDomainList(): CancelablePromise<Array<DomainRetrieve>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/domain/',
    });
  }
  /**
   * Domain Management
   *
   * Manages data domains that categorize different types of clinical/service data.
   * Domains help organize and validate data according to their clinical context.
   * @param requestBody
   * @returns DomainCreate
   * @throws ApiError
   */
  public static apiDomainCreate(requestBody?: DomainCreate): CancelablePromise<DomainCreate> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/domain/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Domain Management
   *
   * Manages data domains that categorize different types of clinical/service data.
   * Domains help organize and validate data according to their clinical context.
   * @param domainId A unique value identifying this domain.
   * @returns DomainRetrieve
   * @throws ApiError
   */
  public static apiDomainRetrieve(domainId: string): CancelablePromise<DomainRetrieve> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/domain/{domain_id}/',
      path: {
        domain_id: domainId,
      },
    });
  }
  /**
   * Domain Management
   *
   * Manages data domains that categorize different types of clinical/service data.
   * Domains help organize and validate data according to their clinical context.
   * @param domainId A unique value identifying this domain.
   * @param requestBody
   * @returns DomainUpdate
   * @throws ApiError
   */
  public static apiDomainUpdate(
    domainId: string,
    requestBody: DomainUpdate,
  ): CancelablePromise<DomainUpdate> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/domain/{domain_id}/',
      path: {
        domain_id: domainId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Domain Management
   *
   * Manages data domains that categorize different types of clinical/service data.
   * Domains help organize and validate data according to their clinical context.
   * @param domainId A unique value identifying this domain.
   * @param requestBody
   * @returns DomainUpdate
   * @throws ApiError
   */
  public static apiDomainPartialUpdate(
    domainId: string,
    requestBody?: PatchedDomainUpdate,
  ): CancelablePromise<DomainUpdate> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/domain/{domain_id}/',
      path: {
        domain_id: domainId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Domain Management
   *
   * Manages data domains that categorize different types of clinical/service data.
   * Domains help organize and validate data according to their clinical context.
   * @param domainId A unique value identifying this domain.
   * @returns void
   * @throws ApiError
   */
  public static apiDomainDestroy(domainId: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/domain/{domain_id}/',
      path: {
        domain_id: domainId,
      },
    });
  }
  /**
   * Vocabulary Management
   *
   * Manages standardized vocabularies used throughout the system.
   * Vocabularies provide controlled terminology for consistent data representation.
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
   * Vocabulary Management
   *
   * Manages standardized vocabularies used throughout the system.
   * Vocabularies provide controlled terminology for consistent data representation.
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
   * Vocabulary Management
   *
   * Manages standardized vocabularies used throughout the system.
   * Vocabularies provide controlled terminology for consistent data representation.
   * @param vocabularyId A unique value identifying this vocabulary.
   * @returns VocabularyRetrieve
   * @throws ApiError
   */
  public static apiVocabularyRetrieve(vocabularyId: string): CancelablePromise<VocabularyRetrieve> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/vocabulary/{vocabulary_id}/',
      path: {
        vocabulary_id: vocabularyId,
      },
    });
  }
  /**
   * Vocabulary Management
   *
   * Manages standardized vocabularies used throughout the system.
   * Vocabularies provide controlled terminology for consistent data representation.
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
        vocabulary_id: vocabularyId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Vocabulary Management
   *
   * Manages standardized vocabularies used throughout the system.
   * Vocabularies provide controlled terminology for consistent data representation.
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
        vocabulary_id: vocabularyId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Vocabulary Management
   *
   * Manages standardized vocabularies used throughout the system.
   * Vocabularies provide controlled terminology for consistent data representation.
   * @param vocabularyId A unique value identifying this vocabulary.
   * @returns void
   * @throws ApiError
   */
  public static apiVocabularyDestroy(vocabularyId: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/vocabulary/{vocabulary_id}/',
      path: {
        vocabulary_id: vocabularyId,
      },
    });
  }
}
