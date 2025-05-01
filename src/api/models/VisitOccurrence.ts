/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VisitOccurrence = {
    readonly visit_occurrence_id: number;
    readonly created_at: string;
    readonly updated_at: string;
    visit_start_date?: string | null;
    visit_end_date?: string | null;
    observations?: string | null;
    person?: number | null;
    provider?: number | null;
    care_site?: number | null;
    visit_concept?: number | null;
    visit_type_concept?: number | null;
};

