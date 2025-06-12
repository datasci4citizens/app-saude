/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterestAreaTrigger } from "./InterestAreaTrigger";
export type InterestArea = {
  interest_area_id?: number | null;
  observation_concept_id?: number | null;
  interest_name?: string | null;
  value_as_string?: string | null;
  triggers?: Array<InterestAreaTrigger>;
  /**
   * Indicates if the interest area is marked for attention
   */
  is_attention_point?: boolean;
  /**
   * Name of the provider associated with the interest area
   */
  readonly provider_name: string;
};
