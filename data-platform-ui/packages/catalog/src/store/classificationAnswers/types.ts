import { EntityState } from '../shared';
import { ClassificationAnswer } from '../../types';
import { Action } from 'redux';

export interface ClassificationAnswersState extends EntityState<ClassificationAnswer> {}

export enum ClassificationAnswersActionType {
  FETCH_REQUEST = 'ClassificationAnswers/FetchRequest',
  FETCH_SUCCESS = 'ClassificationAnswers/FetchSuccess',
  FETCH_FAILURE = 'ClassificationAnswers/FetchFailure',
  RESET = 'ClassificationAnswers/Reset',
  UPDATE = 'ClassificationAnswers/Update'
}

export namespace ClassificationAnswersAction {
  export interface FetchRequestAction extends Action<ClassificationAnswersActionType.FETCH_REQUEST> {
    payload: {
      id: number;
    };
  }

  export interface FetchSuccessAction extends Action<ClassificationAnswersActionType.FETCH_SUCCESS> {
    payload: ClassificationAnswer;
  }

  export interface FetchFailureAction extends Action<ClassificationAnswersActionType.FETCH_FAILURE> {
    payload: {
      id: number;
      error: any;
    };
  }

  export interface UpdateAction extends Action<ClassificationAnswersActionType.UPDATE> {
    payload: ClassificationAnswer;
  }

  export interface ResetAction extends Action<ClassificationAnswersActionType.RESET> {
    payload: {
      id: number;
    };
  }
}

export type ClassificationAnswersActionUnion =
  | ClassificationAnswersAction.FetchRequestAction
  | ClassificationAnswersAction.FetchSuccessAction
  | ClassificationAnswersAction.FetchFailureAction
  | ClassificationAnswersAction.ResetAction
  | ClassificationAnswersAction.UpdateAction;
