import { DropdownOption } from '@bbnpm/bb-ui-framework';
import { DefaultRootState } from 'react-redux';
import { createSelector, ParametricSelector, Selector } from 'reselect';
import isNil from 'lodash/isNil';
import { IResource, IResourceField, ITag } from '../../types';
import { lookupsSelectors } from '../lookups';
import { EntityIdParams } from '../shared';
import { IResourceFieldsState } from './types';

import { resourcesSelectors } from '../resources';

type TagParams = { tagTypeId: number; entityId: number };

const selectEntityIdParam = (_: DefaultRootState, props: EntityIdParams) => props.entityId;

const selectState: Selector<DefaultRootState, IResourceFieldsState> = (state: DefaultRootState) => state.resourceFields;

const selectEntities: Selector<DefaultRootState, List<IResourceField>> = (state: DefaultRootState) =>
  selectState(state).entities;

const selectResourceField: ParametricSelector<DefaultRootState, EntityIdParams, IResourceField | undefined> = (
  state: DefaultRootState,
  props: EntityIdParams
) => selectEntities(state)[selectEntityIdParam(state, props)];

export const _selectTagIds: ParametricSelector<DefaultRootState, TagParams, number[] | undefined> = (
  state: DefaultRootState,
  props: TagParams
) => {
  const resourceField: IResourceField | undefined = selectResourceField(state, props);

  return !isNil(resourceField) && !isNil(resourceField.tagIdByTagTypeId)
    ? resourceField.tagIdByTagTypeId[props.tagTypeId]
    : undefined;
};

export const makeGetResourceField: () => GetResourceField = () =>
  createSelector(selectResourceField, (resourceField: IResourceField | undefined) => resourceField);

export const makeGetResourceResourceFieldOptionList: () => GetResourceResourceFieldOptionList =
  (): GetResourceResourceFieldOptionList =>
    createSelector(
      selectEntities,
      resourcesSelectors.makeGetResource(),
      (entities: List<IResourceField>, resource: IResource | undefined) => {
        if (resource === undefined || resource.fieldIds === undefined || resource.fieldIds.length <= 0) {
          return undefined;
        }

        const options: DropdownOption[] = [];

        for (const fieldId of resource.fieldIds) {
          if (entities[fieldId] !== undefined) {
            options.push({
              value: fieldId,
              label: entities[fieldId].name
            });
          }
        }

        return options.length > 0 ? options : undefined;
      }
    );

export const makeGetResourceResourceFields: () => GetResourceResourceFields = (): GetResourceResourceFields =>
  createSelector(
    selectEntities,
    resourcesSelectors.makeGetResource(),
    (entities: List<IResourceField>, resource: IResource | undefined): IResourceField[] | undefined => {
      if (resource === undefined || resource.fieldIds === undefined || resource.fieldIds.length <= 0) {
        return undefined;
      }

      const resourceFields: IResourceField[] = [];

      for (const fieldId of resource.fieldIds) {
        if (!isNil(entities[fieldId])) {
          resourceFields.push(entities[fieldId]);
        }
      }

      return resourceFields.length > 0 ? resourceFields : undefined;
    }
  );

export const makeGetTagTypeTagIds: () => GetTagTypeTagIds = () =>
  createSelector(_selectTagIds, (tagIds: number[] | undefined) => tagIds);

export const makeGetTagTypeTagNames: () => GetTagTypeTagNames = () =>
  createSelector(
    makeGetTagTypeTagIds(),
    lookupsSelectors._getResourceFieldTagEntities,
    (tagIds: number[] | undefined, tagEntities: List<ITag> = {}) => {
      if (isNil(tagIds) || tagIds.length <= 0 || isNil(tagEntities)) {
        return undefined;
      }

      const tagNames: string[] = [];

      for (const tagId of tagIds) {
        if (!isNil(tagEntities[tagId])) {
          tagNames.push(tagEntities[tagId].name);
        }
      }

      return tagNames.length > 0 ? tagNames : undefined;
    }
  );

export type GetResourceField = ParametricSelector<DefaultRootState, EntityIdParams, IResourceField | undefined>;

export type GetResourceResourceFields = ParametricSelector<
  DefaultRootState,
  EntityIdParams,
  IResourceField[] | undefined
>;

export type GetResourceResourceFieldOptionList = ParametricSelector<
  DefaultRootState,
  EntityIdParams,
  DropdownOption[] | undefined
>;

export type GetTagTypeTagIds = ParametricSelector<DefaultRootState, TagParams, number[] | undefined>;

export type GetTagTypeTagNames = ParametricSelector<DefaultRootState, TagParams, string[] | undefined>;
