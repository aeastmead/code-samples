import { DisplayLink, Entity } from './common';
import { IPerson } from './person';

export interface IPolicyNoteType extends Entity<number> {
  name: string;
}

export interface DatasetPolicyNote extends Entity<number> {
  datasetId: number;
  policyNoteTypeId: number;
  note: string;
  contactIds: number[];
  links: DisplayLink[] | undefined;
  createdAt: Date;
  canEdit: boolean;
}
export interface APIDatasetPolicyNote extends Omit<DatasetPolicyNote, 'contactId'> {
  contactPeople: IPerson[];
}

export interface IAPIDeletedDatasetPolicyNote {
  id: number;
  datasetId: number;
}

export interface DatasetPolicyNoteView {
  id: number;
  note: string;
  links: DisplayLink[] | undefined;
  searchableLinkValue: string;
  created: string;
  createdAtEpoch: number;
  policyNoteType: string;
  contactNames: string[];
  canEdit: boolean;
}

export interface DatasetPolicyNoteCreateModel {
  datasetId: number;
  policyNoteTypeId: number;
  link: string | undefined;
  contactId: number;
  note: string;
}

export interface DatasetPolicyNoteEditModel {
  policyNoteTypeId?: number;
  link?: string | undefined;
  contactId?: number;
  note?: string;
}
