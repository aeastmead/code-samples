import { IDataClassification } from './dataClassification';
import { Entity, HealthMetric } from './common';
import { IPerson } from './person';
import { IResource } from './resource';

export interface Dataset extends Entity {
  name: string;
  description: string;
  resourceIds: number[] | undefined;
  /**
   * Approver uuids
   */
  personIds: number[] | undefined;
  hasDataStore: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canEditApproverIds: boolean;
  canAccess: boolean;
  canRestrictState: CanRestrictState;
  externalPrivilegeUrl: string | undefined;
  requestAccessTerminalFunction: string;
  requestAccessBlink: string;
  categoryName: string | undefined;
  dataOwnerGroupId: number | undefined;
  engineeringOwnerGroupId: number | undefined;
  engineeringOwnerIds: number[] | undefined;
  pwhoId: number | undefined;
  pwhoWebLink: string | undefined;
  dataOwnerIds: number[] | undefined;
  datasetPolicyNoteIds: number[] | undefined;

  /**
   * Snapshot used for search page.
   */
  isSnapshot: boolean;
  isRestricted: boolean;

  metadataHealthScores: HealthMetric[] | undefined;

  mdcLinkUrl: string | undefined;
  mdcRegistration: boolean;

  compactName: string;

  pvfxObject: string | undefined;
  pvfxValue: string | undefined;

  dataClassifications: IDataClassification[] | undefined;

  classifications: string[] | undefined;

  brmRiskValue: number | undefined;
  brmRiskCategory: string | undefined;
  brmRiskHyperLink: string | undefined;
}

/**
 * For display in Dataset Details
 */
export interface DatasetResource extends Pick<IResource, 'id' | 'name' | 'description' | 'resourceTypeId' | 'tagIds'> {
  locationName: string | undefined;
  /**
   * Resource Type name (e.g. Hive, Greenplum)
   */
  resourceType: string | undefined;
  daysToRetain: number | undefined;
  daysToArchive: number | undefined;
}

export interface IAPIDataset
  extends Omit<Dataset, 'personIds' | 'engineeringOwnerIds' | 'dataOwnerIds' | 'datasetPolicyNoteIds'> {
  people: IPerson[] | undefined;
  engineeringOwners: IPerson[] | undefined;
  dataOwners: IPerson[] | undefined;
}
export interface IAPIDatasetOwnership {
  id: number;
  engineeringOwners: IPerson[] | undefined;
  dataOwners: IPerson[] | undefined;
  engineeringOwnerGroupId: number | undefined;
  dataOwnerGroupId: number | undefined;
  pwhoId: number | undefined;
  pwhoWebLink: string | undefined;
  hasDataStore: boolean;
  /**
   * @TODO remove
   */
  canEditDevOwnership: boolean;
}

export const CanRestrictState = {
  FALSE: 'FALSE',
  DISABLED: 'DISABLED',
  TRUE: 'TRUE'
} as const;

export type CanRestrictState =
  | typeof CanRestrictState.FALSE
  | typeof CanRestrictState.DISABLED
  | typeof CanRestrictState.TRUE;

export interface IDatasetEditModel {
  name?: string;
  description?: string;
  personIds?: number[];
  isRestricted?: boolean;
}

export interface TechnicalOwnerIds {
  engineeringOwnerIds: number[];
  dataOwnerIds: number[];
  engineeringOwnerGroupId: number;
}

export interface CreateDatasetRequest {
  datasetCategoryId: number;
  name: string;
  description: string;
  approverIds: number[] | undefined;
  engineeringOwnerIds: number[] | undefined;
  dataOwnerIds: number[] | undefined;
  engineeringOwnerGroupId: number | undefined;
  pwhoId: number | undefined;

  pvfxObjectName: string | undefined;
  pvfxValueName: string | undefined;
  pvfFunction: string | undefined;
  pvfLevel: number | undefined;
}

export type DatasetEditKey = keyof IDatasetEditModel;
