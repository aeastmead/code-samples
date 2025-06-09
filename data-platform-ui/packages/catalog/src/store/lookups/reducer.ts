import { IDatasetCategory, IPolicyNoteType, IResourceType } from '../../types';
import { ILookupsState, LookupsActionType, LookupsActionUnion } from './type';
import NormalUtils from './utils';

const initialState: State = { isFetching: false, didInvalidate: false };

export default function lookups(state: State = initialState, action: Action): State {
  switch (action.type) {
    case LookupsActionType.RESET: {
      return { ...initialState };
    }
    case LookupsActionType.FETCH_REQUEST: {
      return { isFetching: true, didInvalidate: false };
    }
    case LookupsActionType.FETCH_SUCCESS: {
      const { datasetCategories, resourceTypes, resourceFieldTags, resourceTags, policyNoteTypes } = action.payload;

      return {
        datasetCategories: NormalUtils.normalChildState<IDatasetCategory>(datasetCategories),
        resourceTypes: NormalUtils.normalChildState<IResourceType>(resourceTypes),
        resourceFieldTags: NormalUtils.normalTags(resourceFieldTags),
        resourceTags: NormalUtils.normalTags(resourceTags),
        policyNoteTypes: NormalUtils.normalChildState<IPolicyNoteType>(policyNoteTypes),
        isFetching: false,
        didInvalidate: false
      };
    }
    case LookupsActionType.FETCH_FAILURE: {
      const error = action.payload.error;

      return {
        isFetching: false,
        didInvalidate: true,
        error
      };
    }
    default: {
      return state;
    }
  }
}

type State = ILookupsState;

type Action = LookupsActionUnion;
