import { Entity } from './common';

export interface IResourceField extends Entity {
  resourceId: number;
  name: string;
  type: string;
  description: string;
  canEdit: boolean;
  tagIdByTagTypeId: List<number[]> | undefined;
}

export interface IAPIResourceFieldTag {
  id: number;
  tagTypeId: number;
}

export interface IAPIResourceField extends Omit<IResourceField, 'tagIdByTagTypeId'> {
  isRetentionColumn: boolean;
  tags: IAPIResourceFieldTag[] | undefined;
}

export interface IResourceFieldTagEditModel {
  tagTypeId: number;
  tagIds: number[] | undefined;
}

export interface IResourceFieldEditModel {
  description?: string;
  resourceFieldTags?: IResourceFieldTagEditModel;
}

export interface IAPIResourceFieldTagEditModel {
  addResourceFieldTagIds?: number[];
  removeResourceFieldTagIds?: number[];
}

export interface IAPIResourceFieldEditModel
  extends IAPIResourceFieldTagEditModel,
    Omit<IResourceFieldEditModel, 'resourceFieldTags'> {}
