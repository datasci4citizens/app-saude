/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonLinkProviderResponseStatusEnum } from './PersonLinkProviderResponseStatusEnum';
export type PersonLinkProviderResponse = {
    /**
     * Linking result
     *
     * * `linked` - linked
     */
    status: PersonLinkProviderResponseStatusEnum;
    /**
     * Indicates if the relationship already existed
     */
    already_existed: boolean;
};

