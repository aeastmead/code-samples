import isNil from 'lodash/isNil';
import cloneDeep from 'lodash/cloneDeep';
import pullAll from 'lodash/pullAll';
import union from 'lodash/union';
import { combineReducers } from 'redux';
import { Dataset } from '../../types';
import { ResourcesActionType, ResourcesActionUnion } from '../resources';
import { DatasetsActionType, DatasetsActionUnion, IDatasetsState, IUpdatedDataset } from './types';

type EntitiesState = IDatasetsState['entities'];

type StatusesState = IDatasetsState['statuses'];

type Action = DatasetsActionUnion | ResourcesActionUnion;

function changePolicyNoteIds(
  datasetPolicyNoteIds: number[] | undefined,
  {
    addDatasetPolicyNoteIds,
    removeDatasetPolicyNoteIds
  }: Pick<IUpdatedDataset, 'addDatasetPolicyNoteIds' | 'removeDatasetPolicyNoteIds'>
): number[] | undefined {
  if (datasetPolicyNoteIds === undefined) {
    return !isNil(addDatasetPolicyNoteIds) && addDatasetPolicyNoteIds.length > 0
      ? [...addDatasetPolicyNoteIds]
      : undefined;
  }

  if (!isNil(removeDatasetPolicyNoteIds) && removeDatasetPolicyNoteIds.length > 0) {
    datasetPolicyNoteIds = pullAll(datasetPolicyNoteIds, removeDatasetPolicyNoteIds);
  }

  if (!isNil(addDatasetPolicyNoteIds) && addDatasetPolicyNoteIds.length > 0) {
    datasetPolicyNoteIds = union(datasetPolicyNoteIds, addDatasetPolicyNoteIds);
  }
  return datasetPolicyNoteIds;
}

function _changeResourceIds(
  resourceIds: number[] | undefined,
  addResourceIds: number[] | undefined
): number[] | undefined {
  if (isNil(addResourceIds) || addResourceIds.length <= 0) {
    return resourceIds;
  }
  return !isNil(resourceIds) ? union(resourceIds, addResourceIds) : [...addResourceIds];
}

function changeEntity(dataset: Dataset, changes: IUpdatedDataset): Dataset {
  const { addResourceIds, addDatasetPolicyNoteIds, removeDatasetPolicyNoteIds, ...rest } = changes;

  dataset.resourceIds = _changeResourceIds(dataset.resourceIds, addResourceIds);
  dataset.datasetPolicyNoteIds = changePolicyNoteIds(dataset.datasetPolicyNoteIds, {
    addDatasetPolicyNoteIds,
    removeDatasetPolicyNoteIds
  });

  return {
    ...dataset,
    ...rest
  };
}

function entitiesReducer(state: EntitiesState = {}, action: Action): EntitiesState {
  switch (action.type) {
    case DatasetsActionType.FETCH_SUCCESS: {
      const newState: EntitiesState = cloneDeep(state);

      newState[action.payload.id] = {
        ...action.payload
      };

      return newState;
    }
    case DatasetsActionType.RESET: {
      if (isNil(state[action.payload])) {
        return state;
      }

      const newState: EntitiesState = cloneDeep(state);
      delete newState[action.payload];

      return newState;
    }
    case DatasetsActionType.UPDATE: {
      if (isNil(action.payload) || action.payload.length <= 0) {
        return state;
      }

      const newState: EntitiesState = cloneDeep(state);

      for (const updateData of action.payload) {
        if (isNil(newState[updateData.id])) {
          continue;
        }
        newState[updateData.id] = changeEntity(newState[updateData.id], updateData);
      }

      return newState;
    }
    case DatasetsActionType.ADD: {
      if (action.payload.length <= 0) {
        return state;
      }
      const datasets: Dataset[] = action.payload;

      const newState: EntitiesState = cloneDeep(state);

      for (const dataset of datasets) {
        newState[dataset.id] = dataset;
      }

      return newState;
    }
    case ResourcesActionType.BATCH_FETCH_SUCCESS: {
      if (isNil(action.payload.resources) || action.payload.resources.length <= 0) {
        return state;
      }
      const newState: EntitiesState = cloneDeep(state);

      for (const resource of action.payload.resources) {
        if (isNil(resource.datasetId) || newState[resource.datasetId] === undefined) {
          continue;
        }
        newState[resource.datasetId].resourceIds = _changeResourceIds(newState[resource.datasetId].resourceIds, [
          resource.id
        ]);
      }
      return newState;
    }
    default: {
      return state;
    }
  }
}

function statusesReducer(state: StatusesState = {}, action: Action): StatusesState {
  switch (action.type) {
    case DatasetsActionType.RESET: {
      if (isNil(state[action.payload])) {
        return state;
      }

      const newState: StatusesState = cloneDeep(state);
      delete newState[action.payload];

      return newState;
    }

    case DatasetsActionType.FETCH_REQUEST: {
      const newState: StatusesState = cloneDeep(state);
      newState[action.payload.datasetId] = {
        isFetching: true,
        didInvalidate: false,
        isSnapshot: action.payload.snapshot
      };
      return newState;
    }
    case DatasetsActionType.FETCH_SUCCESS: {
      const { isSnapshot, id } = action.payload;

      const newState: StatusesState = cloneDeep(state);
      newState[id] = {
        isFetching: false,
        didInvalidate: false,
        isSnapshot
      };
      return newState;
    }
    case DatasetsActionType.FETCH_FAILURE: {
      const { id, error } = action.payload;
      const isSnapshot: boolean = state[id] !== undefined ? state[id].isSnapshot : false;

      const newState: StatusesState = cloneDeep(state);
      newState[id] = {
        isFetching: false,
        didInvalidate: true,
        error: error,
        isSnapshot
      };

      return newState;
    }

    default: {
      return state;
    }
  }
}
export default combineReducers<IDatasetsState>({ entities: entitiesReducer, statuses: statusesReducer });
