import { Entity, ITag } from '../../types';
import { ILookupChildState, ILookupTagsState } from './type';

function normalTags(tags: ITag[]): ILookupTagsState {
  const entities: List<ITag> = {};
  const byTagTypeId: List<number[]> = {};
  const ids: number[] = [];

  for (const tag of tags) {
    entities[tag.id] = {
      ...tag
    };

    ids.push(tag.id);

    if (byTagTypeId[tag.tagTypeId] === undefined) {
      byTagTypeId[tag.tagTypeId] = [tag.id];
    } else {
      byTagTypeId[tag.tagTypeId].push(tag.id);
    }
  }

  return {
    entities,
    byTagTypeId,
    ids
  };
}

function normalChildState<T extends Entity<number>>(items: T[]): ILookupChildState<T> {
  const entities: List<T> = {};
  const ids: number[] = [];

  for (const item of items) {
    ids.push(item.id);
    entities[item.id] = { ...item };
  }

  return {
    ids,
    entities
  };
}

export default {
  normalTags,
  normalChildState
};
