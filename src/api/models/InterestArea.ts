/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterestAreaTrigger } from './InterestAreaTrigger';
export type InterestArea = {
    name: string;
    is_attention_point?: boolean;
    marked_by?: Array<string>;
    shared_with_provider?: boolean;
    triggers?: Array<InterestAreaTrigger>;
};

