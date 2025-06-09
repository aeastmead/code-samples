import { DropdownOption } from '@bbnpm/bb-ui-framework';
import { DefaultRootState } from 'react-redux';
import { createSelector, ParametricSelector, Selector } from 'reselect';
import { IPolicyNoteType, IResourceType, ITag } from '../../types';
import { EntityIdParams } from '../shared';
import { ILookupsState, ILookupChildState, ILookupTagsState } from './type';
import { OptionValue } from '@nlss/brain-trust';

const selectState: Selector<DefaultRootState, State> = (state: DefaultRootState) => state.lookups;

const selectResourceTypes: Selector<DefaultRootState, State['resourceTypes']> = (state: DefaultRootState) =>
  selectState(state).resourceTypes;

const selectResourceFieldTagsState: Selector<DefaultRootState, ILookupTagsState | undefined> = (
  state: DefaultRootState
) => selectState(state).resourceFieldTags;

const selectTagTypeResourceFieldTagIds: ParametricSelector<DefaultRootState, EntityIdParams, number[] | undefined> = (
  state: DefaultRootState,
  props: EntityIdParams
) => {
  const resourceFieldTags: ILookupTagsState | undefined = selectResourceFieldTagsState(state);
  return resourceFieldTags !== undefined ? resourceFieldTags.byTagTypeId[props.entityId] : undefined;
};

const selectResourceTagsState: Selector<DefaultRootState, ILookupTagsState | undefined> = (state: DefaultRootState) =>
  selectState(state).resourceTags;

const selectTagTypeResourceTagIds: ParametricSelector<DefaultRootState, EntityIdParams, number[] | undefined> = (
  state: DefaultRootState,
  props: EntityIdParams
) => {
  const resourceTags: ILookupTagsState | undefined = selectResourceTagsState(state);
  return resourceTags !== undefined ? resourceTags.ids : undefined;
};

export const getDatasetCategoryOptions: Selector<DefaultRootState, OptionValue<number>[] | undefined> = createSelector(
  selectState,
  ({ datasetCategories }: State) => {
    if (datasetCategories === undefined || datasetCategories.ids.length <= 0) {
      return undefined;
    }
    const { ids, entities } = datasetCategories;

    return ids.map((value: number) => ({ value, label: entities[value].name }));
  }
);

export const getResourceTypeOptions: Selector<DefaultRootState, DropdownOption[] | undefined> = createSelector(
  selectResourceTypes,
  (resourceTypes: State['resourceTypes']) => {
    if (resourceTypes === undefined || resourceTypes.ids.length <= 0) {
      return undefined;
    }

    const { ids, entities }: ILookupChildState<IResourceType> = resourceTypes;
    const options: DropdownOption[] = [];

    for (const id of ids) {
      if (entities[id].canBeRegistered) {
        options.push({
          value: id,
          label: entities[id].name
        });
      }
    }

    return options;
  }
);

export const makeGetResourceType: () => GetResourceType = () =>
  createSelector(
    selectResourceTypes,
    (_: DefaultRootState, props: { entityId: number | undefined }) => props.entityId,
    (resourceTypes: State['resourceTypes'], resourceTypeId: number | undefined) =>
      resourceTypeId !== undefined && resourceTypes !== undefined ? resourceTypes.entities[resourceTypeId] : undefined
  );

export const _getResourceFieldTagEntities: Selector<DefaultRootState, List<ITag> | undefined> = createSelector(
  selectResourceFieldTagsState,
  (tagStates: ILookupTagsState | undefined) => (tagStates !== undefined ? tagStates.entities : undefined)
);

const _convertTagsIntoDropdownOptions = (
  resourceFieldTags: List<ITag> | undefined,
  tagTypeTagIds: number[] | undefined
) => {
  if (tagTypeTagIds === undefined || tagTypeTagIds.length <= 0 || resourceFieldTags === undefined) {
    return undefined;
  }

  const options: DropdownOption[] = [];

  for (const tagId of tagTypeTagIds) {
    if (resourceFieldTags[tagId] !== undefined) {
      options.push({
        value: tagId,
        label: resourceFieldTags[tagId].name
      });
    }
  }
  return options.length > 0 ? options : undefined;
};

export const makeGetTagTypeResourceFieldTagOptions: () => GetTagTypeResourceFieldTagOptions = () =>
  createSelector(_getResourceFieldTagEntities, selectTagTypeResourceFieldTagIds, _convertTagsIntoDropdownOptions);

export const getResourceTagEntities: Selector<DefaultRootState, List<ITag> | undefined> = createSelector(
  selectResourceTagsState,
  (tagStates: ILookupTagsState | undefined) => (tagStates !== undefined ? tagStates.entities : undefined)
);

export const makeGetTagTypeResourceTagOptions: () => GetTagTypeResourceFieldTagOptions = () =>
  createSelector(getResourceTagEntities, selectTagTypeResourceTagIds, _convertTagsIntoDropdownOptions);

export const getPolicyNoteTypes: Selector<DefaultRootState, List<IPolicyNoteType> | undefined> = createSelector(
  selectState,
  (state: State) => (state.policyNoteTypes !== undefined ? state.policyNoteTypes.entities : undefined)
);

export const getPolicyNoteTypeOptions: Selector<DefaultRootState, DropdownOption[] | undefined> = createSelector(
  selectState,
  ({ policyNoteTypes }: State) => {
    if (policyNoteTypes === undefined) {
      return undefined;
    }
    return policyNoteTypes.ids.map((value: number) => ({ value, label: policyNoteTypes.entities[value].name }));
  }
);
type State = ILookupsState;

export type GetResourceType = ParametricSelector<
  DefaultRootState,
  { entityId: number | undefined },
  IResourceType | undefined
>;

export type GetTagTypeResourceFieldTagOptions = ParametricSelector<
  DefaultRootState,
  EntityIdParams,
  DropdownOption[] | undefined
>;
