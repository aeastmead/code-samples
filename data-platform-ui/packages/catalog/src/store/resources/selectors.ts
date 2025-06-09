import { DefaultRootState } from 'react-redux';
import { createSelector, ParametricSelector, Selector } from 'reselect';
import isNil from 'lodash/isNil';
import { IResource } from '../../types';
import { IAsyncState } from '../shared';
import { IResourcesState } from './types';
import ResourcesStoreUtils from './utils';

const selectEntityIdParam = (_: DefaultRootState, props: EntityIdParams | Params) =>
  'id' in props ? props.id : props.entityId;

const selectStatusByDatasetId: ParametricSelector<DefaultRootState, Params, IAsyncState | undefined> = (
  state: DefaultRootState,
  params: Params
) => state.resources.batchStatus[ResourcesStoreUtils.datasetIdBatchStatusKey(params.id)];

export const _getById: ParametricSelector<DefaultRootState, EntityIdParams, IResource | undefined> = (
  state: DefaultRootState,
  { entityId }: EntityIdParams
): IResource | undefined => state.resources.entities[entityId];

export const makeGetDatasetIdLoading: () => GetLoading = () =>
  createSelector(selectStatusByDatasetId, (state: IAsyncState | undefined) => state?.isFetching === true);

export const makeHasFetched: () => GetHasFetched = () =>
  createSelector(selectStatusByDatasetId, (state: IAsyncState | undefined) => !isNil(state));

export const getEntities: Selector<DefaultRootState, State['entities']> = createSelector(
  (state: DefaultRootState) => state.resources,
  (state: State) => state.entities
);

export const makeGetResource: () => GetResource = () =>
  createSelector(
    getEntities,
    selectEntityIdParam,
    (entities: List<IResource>, resourceId: number) => entities[resourceId]
  );

type State = IResourcesState;
type Params = {
  id: number;
};

type EntityIdParams = {
  entityId: number;
};

export type GetLoading = ParametricSelector<DefaultRootState, Params, boolean>;

export type GetHasFetched = ParametricSelector<DefaultRootState, Params, boolean>;

export type GetResource = ParametricSelector<DefaultRootState, EntityIdParams, IResource | undefined>;
