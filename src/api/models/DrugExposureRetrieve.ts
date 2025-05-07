/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DrugExposureRetrieve = {
    readonly drug_exposure_id: number;
    readonly created_at: string;
    readonly updated_at: string;
    drug_exposure_start_date?: string | null;
    drug_exposure_end_date?: string | null;
    stop_reason?: string | null;
    quantity?: number | null;
    interval_hours?: number | null;
    dose_times?: string | null;
    sig?: string | null;
    person?: number | null;
    drug_concept?: number | null;
    drug_type_concept?: number | null;
};

