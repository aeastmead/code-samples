import { Entity } from './common';

export interface IPerson extends Entity {
  name: string;
}

export interface IDataStoreType extends IDataStoreTypeLabels, IDataStoreTypeExternalReport {
  dataStoreTypeId: number;
  name: string;
  enabledForRegistration: boolean;
}

export interface IDataStoreTypeTaxonomy {
  locationName: string;
  resourceName: string;
  resourceNamePlural: string;
  resourceFieldName: string;
  resourceFieldNamePlural: string;
}

export interface IDataStoreTypeExample {
  locationNameExample: string;
  resourceNameExample: string;
}

export interface IDataStoreTypeExternalReport {
  enabledForExternalReport: boolean;
  externalReportCode: string;
}

export interface IDataStoreTypeLabels extends IDataStoreTypeTaxonomy, IDataStoreTypeExample {}
