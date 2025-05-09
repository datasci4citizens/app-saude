/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DrugExposureCreate } from './DrugExposureCreate';
import type { LocationCreate } from './LocationCreate';
import type { ObservationCreate } from './ObservationCreate';
import type { PersonCreate } from './PersonCreate';
export type FullPersonCreate = {
    person: PersonCreate;
    location: LocationCreate;
    observations: Array<ObservationCreate>;
    drug_exposures: Array<DrugExposureCreate>;
};

