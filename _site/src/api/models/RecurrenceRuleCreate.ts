/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RecurrenceRuleCreate = {
  frequency_concept: number;
  interval?: number | null;
  /**
   * String binária com 7 posições: SEG=0, TER=1, ..., SAB=6
   */
  weekday_binary?: string | null;
  readonly valid_start_date: string;
  valid_end_date?: string;
};
