/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserRetrieve = {
    readonly id: number;
    /**
     * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
     */
    readonly username: string;
    readonly email: string;
    readonly full_name: string;
    readonly first_name: string;
    readonly last_name: string;
    /**
     * Designates whether this user should be treated as active. Unselect this instead of deleting accounts.
     */
    readonly is_active: boolean;
    readonly role: string;
    /**
     * Designates whether the user can log into this admin site.
     */
    readonly is_staff: boolean;
    readonly date_joined: string;
};

