/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterestAreaTriggerUpdate } from './InterestAreaTriggerUpdate';
export type InterestAreaUpdate = {
    /**
     * ID of the interest area observation to update
     */
    interest_area_id: number;
    /**
     * New value for the interest area observation
     */
    value_as_string?: string | null;
    /**
     * Indicates if the interest area should be shared with the provider
     */
    shared_with_provider?: boolean;
    /**
     * List of triggers to update within this interest area
     */
    triggers?: Array<InterestAreaTriggerUpdate>;
};

