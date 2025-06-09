import cloneDeep from 'lodash/cloneDeep';
import isNil from 'lodash/isNil';
import { EntityKind } from '../shared';
import { CreateFormsActionType, CreateFormsActionUnion, CreateFormsState } from './types';

const initialState: State = {};

export default function createForms(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CreateFormsActionType.RESET: {
      const kind: EntityKind = action.payload.kind;
      if (isNil(state[kind])) {
        return state;
      }
      const newState: State = cloneDeep(state);

      delete newState[kind];

      return newState;
    }
    case CreateFormsActionType.SAVE_REQUEST: {
      const newState: State = cloneDeep(state);

      newState[action.payload.kind] = {
        saved: false,
        isSaving: true,
        didInvalidate: false
      };

      return newState;
    }
    case CreateFormsActionType.SAVE_FAILURE: {
      const { kind, error } = action.payload;
      const newState: State = cloneDeep(state);

      newState[kind] = {
        saved: false,
        isSaving: false,
        didInvalidate: true,
        error
      };

      return newState;
    }

    case CreateFormsActionType.SAVE_SUCCESS: {
      const { kind, entityId } = action.payload;
      const newState: State = cloneDeep(state);

      newState[kind] = {
        entityId,
        saved: true,
        isSaving: false,
        didInvalidate: false
      };

      return newState;
    }
    default: {
      return state;
    }
  }
}

type State = CreateFormsState;

type Action = CreateFormsActionUnion;
