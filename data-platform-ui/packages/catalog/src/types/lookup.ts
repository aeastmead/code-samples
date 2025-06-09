import { Entity } from './common';
import { IPolicyNoteType } from './policyNote';
import { IResourceType } from './resourceType';

import { ITag } from './tag';

export interface ILookup {
  id: number;
}

export interface IDatasetCategory extends Entity<number> {
  name: string;
}

export interface ILookups {
  datasetCategories: IDatasetCategory[];
  resourceTypes: IResourceType[];
  resourceFieldTags: ITag[];
  policyNoteTypes: IPolicyNoteType[];
  resourceTags: ITag[];
}
