import {
  ClassificationQuestionnaireActionType,
  ClassificationQuestionnaireActionUnion,
  ClassificationQuestionnaireState
} from './type';
import { AsyncStateStatus } from '../shared';

type State = ClassificationQuestionnaireState;

type Action = ClassificationQuestionnaireActionUnion;

const initialState: State = {
  status: AsyncStateStatus.UNINITIALIZED
};

export default function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case ClassificationQuestionnaireActionType.FETCH_REQUEST: {
      return {
        status: AsyncStateStatus.FETCHING
      };
    }
    case ClassificationQuestionnaireActionType.FETCH_FAILURE: {
      return {
        status: AsyncStateStatus.FAILED,
        error: action.payload
      };
    }
    case ClassificationQuestionnaireActionType.FETCH_SUCCESS: {
      const { useCases, categories, categoryIds, personalDataTypes, personalDataTypeIds } = action.payload;

      return {
        status: AsyncStateStatus.SUCCEEDED,
        useCases: { ...useCases },
        categories: {
          ...categories
        },
        categoryIds: [...categoryIds],
        personalDataTypeIds: [...personalDataTypeIds],
        personalDataTypes: { ...personalDataTypes }
      };
    }
    default: {
      return state;
    }
  }
}
