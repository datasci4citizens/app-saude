/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DateRangeTypeEnum } from "./DateRangeTypeEnum";
import type { InterestArea } from "./InterestArea";
export type DiaryCreate = {
  date_range_type: DateRangeTypeEnum;
  text: string;
  text_shared: boolean;
  diary_shared: boolean;
  interest_areas?: Array<InterestArea>;
};
