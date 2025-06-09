import { DefaultRootState } from 'react-redux';
import { createSelector, ParametricSelector, Selector } from 'reselect';
import isNil from 'lodash/isNil';
import { Dataset, DatasetResource, IResource } from '../../types';
import constants from '../../utils/constants';
import { EntityIdParams, ISnapshotAsyncState, SelectorsUtility } from '../shared';
import { resourcesSelectors } from '../resources';
import { IDatasetsState } from './types';

const selectState: Selector<DefaultRootState, IDatasetsState> = (state: DefaultRootState) => state.datasets;

const selectStatus: ParametricSelector<DefaultRootState, Params, StatusState | undefined> = (
  state: DefaultRootState,
  props: Params
) => selectLoadingStatus[props.id];

const selectLoadingStatus: ParametricSelector<DefaultRootState, number, StatusState | undefined> = (
  state: DefaultRootState,
  datasetId: number
) => state.datasets.statuses[datasetId];

export const _getDataset: ParametricSelector<DefaultRootState, Params | EntityIdParams, Dataset | undefined> = (
  state: DefaultRootState,
  props: EntityIdParams | Params
) => {
  const entityId: number = SelectorsUtility.getIdFromParams(props);

  return state.datasets.entities[entityId];
};

/**
 * Sharable selector for each component to prevent memory issues
 *
 * https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances
 * @return {GetDatasetSelector<any, Params, Dataset, (res1: {[p: number]: Dataset}, res2: number) => Dataset>}
 */
export function makeGetDataset(entityId: number): GetDatasetScopedSelector;
export function makeGetDataset(): GetDatasetSelector;
export function makeGetDataset(entityId?: number): GetDatasetScopedSelector | GetDatasetSelector {
  if (typeof entityId === 'number') {
    return createSelector(
      (state: DefaultRootState) => selectState(state).entities,
      (entities: { [id: number]: Dataset }) => entities[entityId]
    );
  }
  return createSelector(
    (state: DefaultRootState) => selectState(state).entities,
    (state: DefaultRootState, props: EntityIdParams | Params | number) => SelectorsUtility.getIdFromParams(props),
    (entities: { [id: number]: Dataset }, entityId: number) => entities[entityId]
  );
}

const makeSelectResourceIds: () => SelectResourceIdsSelector = () =>
  createSelector(makeGetDataset(), (dataset: Dataset | undefined) => {
    return dataset?.resourceIds ?? [];
  });

export type GetIsLoading = ParametricSelector<DefaultRootState, number, boolean>;

export function makeGetIsLoading(): ParametricSelector<DefaultRootState, number, boolean> {
  return createSelector(
    selectLoadingStatus,
    (status: StatusState | undefined) => status !== undefined && status.isFetching
  );
}

export const makeGetResourceCount: () => GetResourceCountSelector = () =>
  createSelector(makeGetDataset(), (dataset: Dataset | undefined) =>
    dataset !== undefined && dataset.resourceIds !== undefined && dataset.resourceIds.length > 0
      ? dataset.resourceIds.length
      : undefined
  );

export const makeGetResourcesSelector: () => GetResourcesSelector = () =>
  createSelector(
    makeSelectResourceIds(),
    resourcesSelectors.getEntities,
    (resourceIds: number[], entities: { [id: number]: IResource }) => {
      const resources: DatasetResource[] = resourceIds.reduce((accum: DatasetResource[], id: number) => {
        if (!isNil(entities[id])) {
          const {
            name,
            alias,
            description,
            resourceTypeId,
            locationName,
            daysToRetain,
            daysToArchive,
            tagIds
          }: IResource = entities[id];
          const resourceType: string | undefined = constants.getResourceType(resourceTypeId);
          accum.push({
            id,
            name: alias ?? name,
            resourceTypeId,
            description,
            resourceType,
            locationName,
            daysToRetain,
            daysToArchive,
            tagIds
          });
        }
        return accum;
      }, []);

      return resources.length > 0 ? resources : undefined;
    }
  );

export const _getExists: ParametricSelector<
  DefaultRootState,
  { entityId: number; ignoreSnapshot?: boolean },
  boolean
> = (state: DefaultRootState, props: { entityId: number; ignoreSnapshot?: boolean }) => {
  const ignoreSnapshot: boolean = props.ignoreSnapshot === true;
  const dataset: Dataset | undefined = _getDataset(state, props);

  if (dataset !== undefined) {
    return ignoreSnapshot ? !dataset.isSnapshot : true;
  }
  const status: ISnapshotAsyncState | undefined = selectStatus(state, { id: props.entityId });

  if (status === undefined) {
    return false;
  }
  return ignoreSnapshot ? !status.isSnapshot : true;
};

export function makeGetClassifications(): GetClassifications {
  return createSelector(
    (state: DefaultRootState, datasetId: number): Dataset | undefined => selectState(state).entities[datasetId],
    (dataset: Dataset | undefined) => {
      if (dataset === undefined || dataset.classifications === undefined || dataset.classifications.length <= 0)
        return undefined;

      return [...dataset.classifications];
    }
  );
}

type StatusState = ISnapshotAsyncState;

type Params = {
  id: number;
};

export type GetDatasetSelector = ParametricSelector<
  DefaultRootState,
  Params | EntityIdParams | number | undefined,
  Dataset | undefined
>;

export type GetResourceCountSelector = ParametricSelector<
  DefaultRootState,
  Params | EntityIdParams | number | undefined,
  number | undefined
>;

export type GetDatasetScopedSelector = Selector<DefaultRootState, Dataset | undefined>;

export type GetResourcesSelector = ParametricSelector<DefaultRootState, Params, DatasetResource[] | undefined>;

type SelectResourceIdsSelector = ParametricSelector<DefaultRootState, Params, number[]>;

export type GetClassifications = ParametricSelector<DefaultRootState, number, string[] | undefined>;
