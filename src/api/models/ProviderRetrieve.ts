/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProviderRetrieve = {
  readonly provider_id: number;
  readonly username: string;
  readonly email: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly created_at: string;
  readonly updated_at: string;
  social_name?: string | null;
  birth_datetime?: string | null;
  profile_picture?: string | null;
  professional_registration?: number;
  user: number;
  specialty_concept?: number | null;
  care_site?: number | null;
};
