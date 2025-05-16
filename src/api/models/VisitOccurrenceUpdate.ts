/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecurrenceRuleUpdate } from "./RecurrenceRuleUpdate";
export type VisitOccurrenceUpdate = {
  readonly visit_occurrence_id: number;
  recurrence_rule?: RecurrenceRuleUpdate;
  visit_start_date?: string | null;
  visit_end_date?: string | null;
  observations?: string | null;
  person?: number | null;
  provider?: number | null;
  care_site?: number | null;
  visit_concept?: number | null;
  visit_type_concept?: number | null;
  recurrence_source_visit?: number | null;
};
