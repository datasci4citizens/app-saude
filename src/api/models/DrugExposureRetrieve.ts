/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecurrenceRuleRetrieve } from './RecurrenceRuleRetrieve';
export type DrugExposureRetrieve = {
    readonly drug_exposure_id: number;
    recurrence_rule?: RecurrenceRuleRetrieve;
    readonly created_at: string;
    readonly updated_at: string;
    stop_reason?: string | null;
    quantity?: number | null;
    sig?: string | null;
    person?: number | null;
    drug_concept?: number | null;
    drug_type_concept?: number | null;
};

