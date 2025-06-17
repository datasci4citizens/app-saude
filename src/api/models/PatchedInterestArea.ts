/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterestAreaTrigger } from "./InterestAreaTrigger";
export type PatchedInterestArea = {
  name?: string;
  is_attention_point?: boolean;
  marked_by?: Array<string>;
  triggers?: Array<InterestAreaTrigger>;
  shared_with_provider?: boolean | null;
};
