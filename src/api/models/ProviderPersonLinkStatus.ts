/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatusEnum } from './StatusEnum';
export type ProviderPersonLinkStatus = {
  /**
   * Linking status
   *
   * * `linked` - linked
   * * `unlinked` - unlinked
   */
  status: StatusEnum;
  /**
   * Number of relationships removed during unlinking
   */
  relationships_removed: number;
  /**
   * ID of the person involved in the linking
   */
  person_id: number;
  /**
   * ID of the provider involved in the linking
   */
  provider_id: number;
};
