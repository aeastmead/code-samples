/* eslint-disable @typescript-eslint/no-namespace */
import { Action } from 'redux';
import {
  ClassificationAnswerEditForm,
  IDatasetEditModel,
  DatasetPolicyNoteEditModel,
  IResourceEditModel,
  IResourceFieldEditModel
} from '../../types';
import { EntityKind, ISaveState } from '../shared';

export interface IEditFormsState {
  /**
   * Unique id
   */
  [id: string]: ISaveState;
}

export enum EditFormsActionType {
  SAVE_REQUEST = 'EditForms/SaveRequest',
  SAVE_SUCCESS = 'EditForms/SaveSuccess',
  SAVE_FAILURE = 'EditForms/SaveFailure',
  RESET = 'EditForms/Reset'
}

export namespace EditFormsAction {
  export interface ISaveRequestAction extends Action<EditFormsActionType.SAVE_REQUEST> {
    payload: {
      id: string;
    };
  }

  export interface ISaveSuccessAction extends Action<EditFormsActionType.SAVE_SUCCESS> {
    payload: {
      id: string;
    };
  }

  export interface ISaveFailureAction extends Action<EditFormsActionType.SAVE_FAILURE> {
    payload: {
      id: string;
      error: any;
    };

    error: true;
  }

  export interface IResetAction extends Action<EditFormsActionType.RESET> {
    payload: {
      id: string;
    };
  }
}

export type EditFormsActionUnion =
  | EditFormsAction.IResetAction
  | EditFormsAction.ISaveRequestAction
  | EditFormsAction.ISaveSuccessAction
  | EditFormsAction.ISaveFailureAction;

/**
 * @example
 * EditFormModel<EntityKind.DATASET> === IDatasetEditModel
 *
 * more details - {@link: https://www.typescriptlang.org/docs/handbook/advanced-types.html#conditional-types}
 */
export type EditFormModel<Kind extends EntityKind> = Kind extends EntityKind.DATASET
  ? IDatasetEditModel
  : Kind extends EntityKind.RESOURCE_FIELD
  ? IResourceFieldEditModel
  : Kind extends EntityKind.RESOURCE
  ? IResourceEditModel
  : Kind extends EntityKind.DATASET_POLICY_NOTE
  ? DatasetPolicyNoteEditModel
  : Kind extends EntityKind.CLASSIFICATION_ANSWER
  ? ClassificationAnswerEditForm
  : unknown;

export type EditFormFieldName<Kind extends EntityKind> = Kind extends EntityKind.CLASSIFICATION_ANSWER
  ? 'all'
  : keyof EditFormModel<Kind>;
