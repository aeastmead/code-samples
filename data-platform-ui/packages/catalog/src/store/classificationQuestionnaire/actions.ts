import { DefaultThunkAction, DefaultThunkDispatch, ThunkExtraArgument } from 'redux-thunk';
import { ClassificationQuestionnaireAction, ClassificationQuestionnaireActionType } from './type';
import { DefaultRootState } from 'react-redux';
import {
  APIClassificationQuestionnaire,
  ClassificationQuestionnaireCategory,
  ClassificationQuestionnairePersonalDataType,
  ClassificationQuestionnaireUseCase,
  IError
} from '../../types';
import { _selectHasInitialized } from './selecters';
import ErrorsUtil from '../../utils/errors';

function fetchAsync(): DefaultThunkAction<Promise<void>> {
  return async (
    dispatch: DefaultThunkDispatch,
    getState: () => DefaultRootState,
    { classificationQuestionnaireService }: ThunkExtraArgument
  ) => {
    if (_selectHasInitialized(getState())) {
      return undefined;
    }
    dispatch(fetchRequest());

    let data: [APIClassificationQuestionnaire.Category[], APIClassificationQuestionnaire.PersonalDataType[]];

    try {
      data = await classificationQuestionnaireService.getAll();
    } catch (cause: unknown) {
      const error: IError = ErrorsUtil.apiErrorWithCause(cause, 'Something went wrong while loading data');
      dispatch(fetchFailure(error));
      return undefined;
    }

    const payload: NormilizedResults = normalizedFetchResult(...data);
    dispatch(fetchSuccess(payload));
    return undefined;
  };
}

function fetchFailure(error: any): ClassificationQuestionnaireAction.FetchFailureAction {
  return {
    type: ClassificationQuestionnaireActionType.FETCH_FAILURE,
    payload: error
  };
}

function fetchRequest(): ClassificationQuestionnaireAction.FetchRequestAction {
  return {
    type: ClassificationQuestionnaireActionType.FETCH_REQUEST
  };
}

function fetchSuccess(
  payload: ClassificationQuestionnaireAction.FetchSuccessAction['payload']
): ClassificationQuestionnaireAction.FetchSuccessAction {
  return {
    type: ClassificationQuestionnaireActionType.FETCH_SUCCESS,
    payload
  };
}

type NormilizedResults = ClassificationQuestionnaireAction.FetchSuccessActionPayload;

/**
 *
 * @param apiCategory
 * @param useCaseContext - Contains previous category's use cases
 *
 *
 */
function normalizeCategory(
  apiCategory: APIClassificationQuestionnaire.Category,
  useCaseContext: List<ClassificationQuestionnaireUseCase>
): ClassificationQuestionnaireCategory {
  const useCaseIds: number[] = [];
  for (const uc of apiCategory.useCases) {
    useCaseIds.push(uc.id);
    useCaseContext[uc.id] = {
      ...uc,
      categoryId: apiCategory.id
    };
  }
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    useCaseIds
  };
}

function normalizedFetchResult(
  apiCategories: APIClassificationQuestionnaire.Category[],
  apiPersonals: APIClassificationQuestionnaire.PersonalDataType[]
): NormilizedResults {
  const useCases: List<ClassificationQuestionnaireUseCase> = {};
  const categories: List<ClassificationQuestionnaireCategory> = {};
  const categoryIds: number[] = [];

  const personalDataTypes: List<ClassificationQuestionnairePersonalDataType> = {};

  const personalDataTypeIds: number[] = [];

  for (const personal of apiPersonals) {
    personalDataTypes[personal.id] = {
      ...personal
    };
    personalDataTypeIds.push(personal.id);
  }

  for (const cat of apiCategories) {
    categories[cat.id] = normalizeCategory(cat, useCases);
    categoryIds.push(cat.id);
  }

  return {
    categories,
    categoryIds,
    useCases,
    personalDataTypeIds,
    personalDataTypes
  };
}

export default {
  fetchAsync,
  fetchRequest,
  fetchSuccess,
  fetchFailure
} as ClassificationQuestionnaireActions;

export interface ClassificationQuestionnaireActions {
  fetchFailure(error: any): ClassificationQuestionnaireAction.FetchFailureAction;
  fetchSuccess(payload: NormilizedResults): ClassificationQuestionnaireAction.FetchSuccessAction;
  fetchRequest(): ClassificationQuestionnaireAction.FetchRequestAction;
  fetchAsync(): DefaultThunkAction<Promise<void>>;
}
