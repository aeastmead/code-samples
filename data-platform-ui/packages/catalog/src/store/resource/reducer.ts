import { IResourceField } from '../../types';
import { ResourceActionType, ResourceActionUnion, IResourceState } from './types';
import cloneDeep from 'lodash/cloneDeep';
import isNil from 'lodash/isNil';

const initialState = {
  id: undefined,
  error: false,
  isFetching: false,
  didInvalidate: false
};

export default function resource(state: IResourceState = initialState, action: ResourceActionUnion): IResourceState {
  switch (action.type) {
    case ResourceActionType.FETCH_REQUEST: {
      return {
        id: action.payload.id,
        error: false,
        isFetching: true,
        didInvalidate: false
      };
    }
    case ResourceActionType.FETCH_SUCCESS: {
      return {
        ...initialState,
        data: action.payload,
        isFetching: false,
        didInvalidate: false
      };
    }
    case ResourceActionType.FETCH_FAILURE: {
      return {
        ...initialState,
        id: action.payload.id,
        errorMsg: action.payload.error,
        error: action.error,
        isFetching: false,
        didInvalidate: true
      };
    }
    case ResourceActionType.UPDATE: {
      const data = action.payload;
      const id = data?.id;
      return {
        id,
        data,
        error: false,
        isFetching: false,
        didInvalidate: false
      };
    }
    case ResourceActionType.UPDATE_FIELD: {
      if (isNil(state.data) || isNil(state.data.fields) || state.data.fields.length <= 0) {
        return state;
      }
      const updatedField: IResourceField = action.payload;

      const fields: IResourceField[] = cloneDeep(state.data.fields);
      for (let i = 0; i < fields.length; i++) {
        if (fields[i].id === updatedField.id) {
          fields[i] = { ...fields[i], ...updatedField };
          break;
        }
      }

      return {
        ...state,
        data: {
          ...state.data,
          fields
        }
      };
    }
    default: {
      return state;
    }
  }
}
