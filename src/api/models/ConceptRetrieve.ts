/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConceptRelated } from "./ConceptRelated";
export type ConceptRetrieve = {
  readonly concept_id: number;
  concept_name?: string | null;
  readonly translated_name: string;
  concept_class?: string | null;
  vocabulary?: string | null;
  domain?: string | null;
  concept_code?: string | null;
  readonly related_concept: ConceptRelated;
};
