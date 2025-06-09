import cloneDeep from 'lodash/cloneDeep';

import { combineReducers } from 'redux';
import { DatasetPolicyNotesActionType, DatasetPolicyNotesActionUnion, DatasetPolicyNotesState } from './types';

type EntitiesState = DatasetPolicyNotesState['entities'];

type BatchStatusesState = DatasetPolicyNotesState['batchStatuses'];

type DeleteStatusesState = DatasetPolicyNotesState['deleteStatuses'];

type Action = DatasetPolicyNotesActionUnion;

function entitiesReducer(state: EntitiesState = {}, action: Action): EntitiesState {
  switch (action.type) {
    case DatasetPolicyNotesActionType.BATCH_FETCH_SUCCESS: {
      if (action.payload.datasetPolicyNotes === undefined) {
        return state;
      }

      const newState: EntitiesState = cloneDeep(state);
      for (const entity of action.payload.datasetPolicyNotes) {
        newState[entity.id] = { ...entity };
      }

      return newState;
    }
    case DatasetPolicyNotesActionType.ADD: {
      const newState: EntitiesState = cloneDeep(state);

      for (const entity of action.payload) {
        newState[entity.id] = { ...entity };
      }
      return newState;
    }
    case DatasetPolicyNotesActionType.DELETE_SUCCESS: {
      if (state[action.payload] === undefined) {
        return state;
      }

      const newState: EntitiesState = cloneDeep(state);
      delete newState[action.payload];

      return newState;
    }
    default: {
      return state;
    }
  }
}

function batchStatusesReducer(state: BatchStatusesState = {}, action: Action): BatchStatusesState {
  switch (action.type) {
    case DatasetPolicyNotesActionType.BATCH_RESET: {
      if (!state[action.payload.key]) {
        return state;
      }

      const newState: BatchStatusesState = cloneDeep(state);

      delete newState[action.payload.key];
      return newState;
    }
    case DatasetPolicyNotesActionType.BATCH_FETCH_REQUEST: {
      const newState: BatchStatusesState = cloneDeep(state);
      newState[action.payload.key] = {
        isFetching: true,
        didInvalidate: false
      };

      return newState;
    }
    case DatasetPolicyNotesActionType.BATCH_FETCH_FAILURE: {
      const newState: BatchStatusesState = cloneDeep(state);
      newState[action.payload.key] = {
        isFetching: false,
        didInvalidate: true,
        error: action.payload.error
      };
      return newState;
    }
    case DatasetPolicyNotesActionType.BATCH_FETCH_SUCCESS: {
      const newState: BatchStatusesState = cloneDeep(state);
      newState[action.payload.key] = {
        isFetching: false,
        didInvalidate: false
      };

      return newState;
    }
    default: {
      return state;
    }
  }
}

function deleteStatusesReducer(state: DeleteStatusesState = {}, action: Action): DeleteStatusesState {
  switch (action.type) {
    case DatasetPolicyNotesActionType.DELETE_RESET: {
      if (state[action.payload] === undefined) {
        return state;
      }
      const newState: DeleteStatusesState = cloneDeep(state);

      delete newState[action.payload];
      return newState;
    }
    case DatasetPolicyNotesActionType.DELETE_REQUEST: {
      const newState: DeleteStatusesState = cloneDeep(state);

      newState[action.payload] = {
        deleted: false,
        isDeleting: true,
        didInvalidate: false
      };

      return newState;
    }
    case DatasetPolicyNotesActionType.DELETE_FAILURE: {
      const newState: DeleteStatusesState = cloneDeep(state);

      newState[action.payload.id] = {
        deleted: false,
        isDeleting: false,
        didInvalidate: true,
        error: action.payload.error
      };

      return newState;
    }
    case DatasetPolicyNotesActionType.DELETE_SUCCESS: {
      const newState: DeleteStatusesState = cloneDeep(state);

      newState[action.payload] = {
        deleted: true,
        isDeleting: false,
        didInvalidate: false
      };

      return newState;
    }
    default: {
      return state;
    }
  }
}

export default combineReducers<DatasetPolicyNotesState>({
  entities: entitiesReducer,
  batchStatuses: batchStatusesReducer,
  deleteStatuses: deleteStatusesReducer
});
