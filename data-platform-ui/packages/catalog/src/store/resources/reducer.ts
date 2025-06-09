import isNil from 'lodash/isNil';
import cloneDeep from 'lodash/cloneDeep';
import { combineReducers } from 'redux';
import { IResource } from '../../types';
import { IResourcesState, ResourcesActionType, ResourcesActionUnion } from './types';

function entitiesReducer(state: State['entities'] = {}, action: Action): State['entities'] {
  switch (action.type) {
    case ResourcesActionType.BATCH_FETCH_SUCCESS: {
      if (action.payload.resources === undefined) {
        return state;
      }
      const resources: IResource[] = action.payload.resources;

      const newState: State['entities'] = cloneDeep(state);
      for (const resource of resources) {
        newState[resource.id] = { ...resource };
      }
      return newState;
    }
    case ResourcesActionType.FETCH_SUCCESS: {
      const newState: State['entities'] = cloneDeep(state);
      newState[action.payload.id] = {
        ...action.payload
      };
      return newState;
    }
    case ResourcesActionType.ADD: {
      if (action.payload.length <= 0) {
        return state;
      }
      const resources: IResource[] = action.payload;

      const newState: State['entities'] = cloneDeep(state);

      for (const resource of resources) {
        newState[resource.id] = {
          ...resource
        };
      }

      return newState;
    }
    default: {
      return state;
    }
  }
}

function batchStatusesReducer(state: State['batchStatus'] = {}, action: Action): State['batchStatus'] {
  switch (action.type) {
    case ResourcesActionType.BATCH_RESET: {
      const key: string = action.payload.key;
      if (isNil(state[key])) {
        return state;
      }

      const newState: State['batchStatus'] = cloneDeep(state);
      delete newState[key];
      return newState;
    }

    case ResourcesActionType.BATCH_FETCH_REQUEST: {
      const key: string = action.payload.key;

      const newState: State['batchStatus'] = cloneDeep(state);
      newState[key] = {
        isFetching: true,
        didInvalidate: false
      };

      return newState;
    }
    case ResourcesActionType.BATCH_FETCH_SUCCESS: {
      const key: string = action.payload.key;

      const newState: State['batchStatus'] = cloneDeep(state);
      newState[key] = {
        isFetching: false,
        didInvalidate: false
      };
      return newState;
    }

    case ResourcesActionType.BATCH_FETCH_FAILURE: {
      const { key, error } = action.payload;

      const newState: State['batchStatus'] = cloneDeep(state);
      newState[key] = {
        isFetching: false,
        didInvalidate: true,
        error
      };
      return newState;
    }
    default: {
      return state;
    }
  }
}

function statusesReducer(state: State['statuses'] = {}, action: Action): State['statuses'] {
  switch (action.type) {
    case ResourcesActionType.FETCH_REQUEST: {
      const resourceId: number = action.payload;

      const newState: State['statuses'] = cloneDeep(state);

      newState[resourceId] = {
        isFetching: true,
        didInvalidate: false
      };
      return newState;
    }
    case ResourcesActionType.FETCH_SUCCESS: {
      const newState: State['statuses'] = cloneDeep(state);
      newState[action.payload.id] = {
        isFetching: false,
        didInvalidate: false
      };
      return newState;
    }
    case ResourcesActionType.FETCH_FAILURE: {
      const { id, error } = action.payload;
      const newState: State['statuses'] = cloneDeep(state);
      newState[id] = {
        isFetching: false,
        didInvalidate: true,
        error
      };
      return newState;
    }
    default: {
      return state;
    }
  }
}

export default combineReducers<IResourcesState>({
  entities: entitiesReducer,
  batchStatus: batchStatusesReducer,
  statuses: statusesReducer
});

type State = IResourcesState;

type Action = ResourcesActionUnion;
