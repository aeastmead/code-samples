import { ClassificationAnswersAction, ClassificationAnswersActionType } from './types';
import { ClassificationAnswer, IError } from '../../types';
import { DefaultThunkAction, DefaultThunkDispatch, ThunkExtraArgument } from 'redux-thunk';
import { DefaultRootState } from 'react-redux';
import ErrorsUtil from '../../utils/errors';
import { _selectHasInitialized } from './selectors';

namespace ClassificationAnswersActionCreators {
  export function fetchRequestAsync(datasetId: number): DefaultThunkAction<Promise<void>> {
    return async (
      dispatch: DefaultThunkDispatch,
      getState: () => DefaultRootState,
      { classificationQuestionnaireService }: ThunkExtraArgument
    ) => {
      if (_selectHasInitialized(getState(), datasetId)) {
        return undefined;
      }

      dispatch(fetchRequest(datasetId));

      let data: ClassificationAnswer | undefined;

      try {
        data = await classificationQuestionnaireService.getSelectionsById(datasetId);
      } catch (cause: unknown) {
        const error: IError = ErrorsUtil.apiErrorWithCause(cause, 'Something went wrong while loading data');
        dispatch(fetchFailure(datasetId, error));
        return undefined;
      }

      if (data !== undefined) {
        dispatch(fetchSuccess(data));
      } else {
        const error: IError = ErrorsUtil.apiError('Unable to load data classification');
        dispatch(fetchFailure(datasetId, error));
      }
      return undefined;
    };
  }

  export function fetchRequest(datasetId: number): ClassificationAnswersAction.FetchRequestAction {
    return {
      type: ClassificationAnswersActionType.FETCH_REQUEST,
      payload: { id: datasetId }
    };
  }

  export function fetchFailure(datasetId: number, error: any): ClassificationAnswersAction.FetchFailureAction {
    return {
      type: ClassificationAnswersActionType.FETCH_FAILURE,
      payload: {
        id: datasetId,
        error
      }
    };
  }

  export function fetchSuccess(
    datasetClassification: ClassificationAnswer
  ): ClassificationAnswersAction.FetchSuccessAction {
    return {
      type: ClassificationAnswersActionType.FETCH_SUCCESS,
      payload: datasetClassification
    };
  }

  export function update(datasetClassification: ClassificationAnswer): ClassificationAnswersAction.UpdateAction {
    return {
      type: ClassificationAnswersActionType.UPDATE,
      payload: datasetClassification
    };
  }

  export function reset(datasetId: number): ClassificationAnswersAction.ResetAction {
    return {
      type: ClassificationAnswersActionType.RESET,
      payload: { id: datasetId }
    };
  }
}

export default ClassificationAnswersActionCreators;
