import { AsyncState } from '../shared';
import {
  ClassificationQuestionnaireCategory,
  ClassificationQuestionnaireUseCase,
  ClassificationQuestionnairePersonalDataType
} from '../../types';
import { Action } from 'redux';

export interface ClassificationQuestionnaireState extends AsyncState {
  categories?: List<ClassificationQuestionnaireCategory>;
  categoryIds?: number[];
  useCases?: List<ClassificationQuestionnaireUseCase>;
  personalDataTypes?: List<ClassificationQuestionnairePersonalDataType>;
  personalDataTypeIds?: number[];
}

export enum ClassificationQuestionnaireActionType {
  FETCH_REQUEST = 'ClassificationQuestionnaire/FetchRequest',
  FETCH_SUCCESS = 'ClassificationQuestionnaire/FetchSuccess',
  FETCH_FAILURE = 'ClassificationQuestionnaire/FetchFailure'
}

export namespace ClassificationQuestionnaireAction {
  export interface FetchSuccessActionPayload {
    categories: List<ClassificationQuestionnaireCategory>;
    categoryIds: number[];
    useCases: List<ClassificationQuestionnaireUseCase>;
    personalDataTypes: List<ClassificationQuestionnairePersonalDataType>;
    personalDataTypeIds: number[];
  }
  export interface FetchRequestAction extends Action<ClassificationQuestionnaireActionType.FETCH_REQUEST> {}

  export interface FetchSuccessAction extends Action<ClassificationQuestionnaireActionType.FETCH_SUCCESS> {
    payload: FetchSuccessActionPayload;
  }

  export interface FetchFailureAction extends Action<ClassificationQuestionnaireActionType.FETCH_FAILURE> {
    payload: any;
  }
}

export type ClassificationQuestionnaireActionUnion =
  | ClassificationQuestionnaireAction.FetchSuccessAction
  | ClassificationQuestionnaireAction.FetchRequestAction
  | ClassificationQuestionnaireAction.FetchFailureAction;
