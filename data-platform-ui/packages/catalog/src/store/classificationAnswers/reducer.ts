import { ClassificationAnswersActionType, ClassificationAnswersActionUnion, ClassificationAnswersState } from './types';
import cloneDeep from 'lodash/cloneDeep';
import { AsyncStateStatus } from '../shared';
import { combineReducers } from 'redux';

type EntitiesState = ClassificationAnswersState['entities'];

type Action = ClassificationAnswersActionUnion;

function entitiesReducer(state: EntitiesState = {}, action: Action): EntitiesState {
  switch (action.type) {
    case ClassificationAnswersActionType.UPDATE:
    case ClassificationAnswersActionType.FETCH_SUCCESS: {
      const newState: EntitiesState = cloneDeep(state);

      newState[action.payload.id] = {
        ...action.payload
      };

      return newState;
    }
    case ClassificationAnswersActionType.RESET: {
      if (state[action.payload.id] === undefined) return state;

      const newState: EntitiesState = cloneDeep(state);
      delete newState[action.payload.id];
      return newState;
    }
    default: {
      return state;
    }
  }
}

type StatusesState = ClassificationAnswersState['statuses'];

function statusesReducer(state: StatusesState = {}, action: Action): StatusesState {
  switch (action.type) {
    case ClassificationAnswersActionType.FETCH_REQUEST: {
      const newState: StatusesState = cloneDeep(state);
      newState[action.payload.id] = {
        status: AsyncStateStatus.FETCHING
      };
      return newState;
    }

    case ClassificationAnswersActionType.FETCH_FAILURE: {
      const newState: StatusesState = cloneDeep(state);
      newState[action.payload.id] = {
        status: AsyncStateStatus.FAILED,
        error: action.payload.error
      };
      return newState;
    }
    case ClassificationAnswersActionType.UPDATE:
    case ClassificationAnswersActionType.FETCH_SUCCESS: {
      const newState: StatusesState = cloneDeep(state);
      newState[action.payload.id] = {
        status: AsyncStateStatus.SUCCEEDED
      };
      return newState;
    }
    case ClassificationAnswersActionType.RESET: {
      if (state[action.payload.id] === undefined) return state;
      const newState: StatusesState = cloneDeep(state);
      delete newState[action.payload.id];
      return newState;
    }
    default: {
      return state;
    }
  }
}

export default combineReducers<ClassificationAnswersState>({
  entities: entitiesReducer,
  statuses: statusesReducer
});
