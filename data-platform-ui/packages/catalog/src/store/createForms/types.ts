import { Action } from 'redux';
import type { CreateDatasetRequest, DatasetPolicyNoteCreateModel, ResourceCreateModel } from '../../types';
import { EntityKind, ISaveState } from '../shared';

export type CreateFormsState = {
  [K in EntityKind]?: CreateFormChildState;
};

export type CreateFormChildState = IPreSavedChildState | ISavedChildState;

interface IPreSavedChildState extends Omit<ISaveState, 'saved'> {
  saved: false;
}

interface ISavedChildState extends Omit<ISaveState, 'saved'> {
  saved: true;
  entityId: number;
}

export function isSavedChildState(state: CreateFormChildState): state is ISavedChildState {
  return state.saved;
}

export enum CreateFormsActionType {
  SAVE_REQUEST = 'CreateForms/SaveRequest',
  SAVE_SUCCESS = 'CreateForms/SaveSuccess',
  SAVE_FAILURE = 'CreateForms/SaveFailure',
  RESET = 'CreateForms/Reset'
}

export namespace CreateFormsAction {
  export interface ISaveRequestAction extends Action<CreateFormsActionType.SAVE_REQUEST> {
    payload: {
      kind: EntityKind;
    };
  }

  export interface ISaveSuccessAction extends Action<CreateFormsActionType.SAVE_SUCCESS> {
    payload: {
      kind: EntityKind;
      entityId: number;
    };
  }

  export interface ISaveFailureAction extends Action<CreateFormsActionType.SAVE_FAILURE> {
    payload: {
      kind: EntityKind;
      error: any;
    };

    error: true;
  }

  export interface IResetAction extends Action<CreateFormsActionType.RESET> {
    payload: {
      kind: EntityKind;
    };
  }
}

export type CreateFormsActionUnion =
  | CreateFormsAction.IResetAction
  | CreateFormsAction.ISaveRequestAction
  | CreateFormsAction.ISaveSuccessAction
  | CreateFormsAction.ISaveFailureAction;

export type CreateFormModel<Kind extends EntityKind> = Kind extends EntityKind.DATASET
  ? CreateDatasetRequest
  : Kind extends EntityKind.RESOURCE
  ? ResourceCreateModel
  : Kind extends EntityKind.DATASET_POLICY_NOTE
  ? DatasetPolicyNoteCreateModel
  : unknown;

export type CreateFormFieldName<Kind extends EntityKind> = keyof CreateFormModel<Kind>;
