/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatusEnum } from "./StatusEnum";
export type PersonLinkProviderResponse = {
  /**
   * Resultado do vínculo
   *
   * * `linked` - linked
   */
  status: StatusEnum;
  /**
   * Indica se o relacionamento já existia antes
   */
  already_existed: boolean;
};
