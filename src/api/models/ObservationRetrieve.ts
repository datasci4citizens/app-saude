/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ObservationRetrieve = {
    readonly observation_id: number;
    readonly created_at: string;
    readonly updated_at: string;
    value_as_string?: string | null;
    observation_date?: string | null;
    observation_source_value?: string | null;
    shared_with_provider?: boolean | null;
    person?: number | null;
    provider?: number | null;
    observation_concept?: number | null;
    value_as_concept?: number | null;
    observation_type_concept?: number | null;
};

