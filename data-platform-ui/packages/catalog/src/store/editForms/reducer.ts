import isNil from 'lodash/isNil';
import cloneDeep from 'lodash/cloneDeep';
import { EditFormsActionUnion, EditFormsActionType, IEditFormsState } from './types';

const initialState: State = {};

export default function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case EditFormsActionType.RESET: {
      const id = action.payload.id;
      if (isNil(state[id])) {
        return state;
      }

      const newState = cloneDeep(state);
      delete state[id];

      return newState;
    }
    case EditFormsActionType.SAVE_REQUEST: {
      const id = action.payload.id;
      const newState = cloneDeep(state);
      newState[id] = {
        saved: false,
        isSaving: true,
        didInvalidate: false
      };

      return newState;
    }
    case EditFormsActionType.SAVE_SUCCESS: {
      const id = action.payload.id;

      const newState = cloneDeep(state);
      newState[id] = {
        saved: true,
        isSaving: false,
        didInvalidate: false
      };

      return newState;
    }
    case EditFormsActionType.SAVE_FAILURE: {
      const { id, error } = action.payload;

      const newState = cloneDeep(state);
      newState[id] = {
        saved: false,
        isSaving: false,
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

type State = IEditFormsState;

type Action = EditFormsActionUnion;
