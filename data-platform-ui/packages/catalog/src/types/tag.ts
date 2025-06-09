import { Entity } from './common';

export interface ITagType extends Entity<number> {
  name: string;
}

export interface ITag extends Entity<number> {
  tagTypeId: number;
  name: string;
}

export interface IAPITagEditModel {
  addTagIds?: number[];
  removeTagIds?: number[];
}
