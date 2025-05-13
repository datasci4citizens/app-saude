/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecurrenceRuleCreate } from './RecurrenceRuleCreate';
export type DrugExposureCreate = {
    recurrence_rule?: RecurrenceRuleCreate;
    stop_reason?: string | null;
    quantity?: number | null;
    sig?: string | null;
    person?: number | null;
    drug_concept?: number | null;
    drug_type_concept?: number | null;
};

