/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecurrenceRuleUpdate } from './RecurrenceRuleUpdate';
export type PatchedDrugExposureUpdate = {
    readonly drug_exposure_id?: number;
    recurrence_rule?: RecurrenceRuleUpdate;
    stop_reason?: string | null;
    quantity?: number | null;
    sig?: string | null;
    person?: number | null;
    drug_concept?: number | null;
    drug_type_concept?: number | null;
};

