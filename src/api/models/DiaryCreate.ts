/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DateRangeTypeEnum } from './DateRangeTypeEnum';
export type DiaryCreate = {
    date_range_type: DateRangeTypeEnum;
    text: string;
    text_shared: boolean;
    habits_shared: boolean;
    wellness_shared: boolean;
    habits?: Array<Record<string, any>>;
    wellness?: Array<Record<string, any>>;
};

