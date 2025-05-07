/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DrugExposureRetrieve } from './DrugExposureRetrieve';
import type { LocationRetrieve } from './LocationRetrieve';
import type { ObservationRetrieve } from './ObservationRetrieve';
import type { PersonRetrieve } from './PersonRetrieve';
export type FullPersonRetrieve = {
    person: PersonRetrieve;
    location: LocationRetrieve;
    observations: Array<ObservationRetrieve>;
    drug_exposures: Array<DrugExposureRetrieve>;
};

