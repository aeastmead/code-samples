import { Entity } from './common';
import { IPerson } from './person';
import { IAPIResourceField, IResourceField } from './resourceField';

export enum ExternalReportType {
  PROFILE = 1,
  SAMPLE = 2
}

export interface IResource extends Entity {
  id: number;
  resourceTypeId: number;
  resourceType: string | undefined;
  alias: string | undefined;
  name: string;
  description: string;
  fieldIds: number[] | undefined;
  retentionFieldId: number | undefined;
  dataOwnerGroupId: number | undefined;
  engineeringOwnerGroupId: number | undefined;
  engineeringOwnerIds: number[] | undefined;
  dataOwnerIds: number[] | undefined;
  datasetId: number | undefined;
  canEdit: boolean;
  externalReports: IExternalReport | undefined;
  locationName: string | undefined;
  cluster: string | undefined;

  daysToRetain: number | undefined;
  daysToArchive: number | undefined;
  retentionNotes: string | undefined;
  tagIds: number[] | undefined;
}

export interface IResourceWithFields extends Omit<IResource, 'fieldIds' | 'retentionFieldId'> {
  fields: IResourceField[] | undefined;
}

export interface IExternalReport {
  [reportId: number]: string;
}

export interface IAPIResourceTag {
  id: number;
  tagTypeId: number;
}

export interface IAPIResource
  extends Omit<IResourceWithFields, 'engineeringOwnerIds' | 'dataOwnerIds' | 'fields' | 'tagIds'> {
  engineeringOwners: IPerson[] | undefined;
  dataOwners: IPerson[] | undefined;
  fields: IAPIResourceField[] | undefined;
  tags: IAPIResourceTag[] | undefined;
}

export interface IResourceEditModel {
  alias?: string;
  description?: string;
  engineeringOwnerIds?: number[];
  engineeringOwnerGroupId?: number;
  dataOwnerIds?: number[];
  dataOwnerGroupId?: number;
  daysToRetain?: number;
  daysToArchive?: number;
  retentionNotes?: string;
  retentionResourceFieldId?: number;
  editTags?: boolean;
  resourceTagIds?: number[];
  addResourceTagIds?: number[];
  removeResourceTagIds?: number[];
}

export interface IResourceWithoutOwnersCreateModel {
  datasetId: number;
  withOwners: false;
  locationName: string;
  resourceName: string;
  resourceTypeId: number;
}

export interface IResourceCreateWithOwnersModel {
  datasetId: number;
  withOwners: true;
  locationName: string;
  resourceName: string;
  resourceTypeId: number;
  dataOwnerGroupId: number;
  engineeringOwnerGroupId: number;
  engineeringOwnerIds: number[];
  dataOwnerIds: number[];
}

export type ResourceCreateModel = IResourceWithoutOwnersCreateModel | IResourceCreateWithOwnersModel;

export interface IResourceFailedVerification {
  code: string;
  message: string;
}

export interface IResourceTagEditModel {
  tagTypeId?: number;
  tagIds: number[] | undefined;
}
