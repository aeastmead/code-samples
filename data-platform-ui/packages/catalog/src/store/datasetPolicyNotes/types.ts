import { Action } from 'redux';
import { DatasetPolicyNote } from '../../types';
import { IDeleteStatusState, IEntityWithBatchStatuesState } from '../shared';

export interface DatasetPolicyNotesState extends Omit<IEntityWithBatchStatuesState<DatasetPolicyNote>, 'statuses'> {
  deleteStatuses: List<IDeleteStatusState>;
}

export enum DatasetPolicyNotesActionType {
  BATCH_FETCH_REQUEST = 'DatasetPolicyNotes/BatchFetchRequest',
  BATCH_FETCH_SUCCESS = 'DatasetPolicyNotes/BatchFetchSuccess',
  BATCH_FETCH_FAILURE = 'DatasetPolicyNotes/BatchFetchFailure',
  BATCH_RESET = 'DatasetPolicyNotes/BatchReset',
  DELETE_REQUEST = 'DatasetPolicyNotes/DeleteRequest',
  DELETE_SUCCESS = 'DatasetPolicyNotes/DeleteSuccess',
  DELETE_FAILURE = 'DatasetPolicyNotes/DeleteFailure',
  DELETE_RESET = 'DatasetPolicyNotes/DeleteReset',
  ADD = 'DatasetPolicyNotes/Add'
}

export namespace DatasetPolicyNotesAction {
  export interface IBatchFetchRequestAction extends Action<DatasetPolicyNotesActionType.BATCH_FETCH_REQUEST> {
    payload: {
      key: string;
    };
  }

  export interface IBatchFetchSuccessAction extends Action<DatasetPolicyNotesActionType.BATCH_FETCH_SUCCESS> {
    payload: {
      key: string;
      datasetPolicyNotes: DatasetPolicyNote[] | undefined;
    };
  }

  export interface IBatchFetchFailureAction extends Action<DatasetPolicyNotesActionType.BATCH_FETCH_FAILURE> {
    payload: {
      key: string;
      error: any;
    };
    error: true;
  }

  export interface IBatchResetAction extends Action<DatasetPolicyNotesActionType.BATCH_RESET> {
    payload: {
      key: string;
    };
  }

  export interface IAddAction extends Action<DatasetPolicyNotesActionType.ADD> {
    payload: DatasetPolicyNote[];
  }

  export interface IDeleteRequestAction extends Action<DatasetPolicyNotesActionType.DELETE_REQUEST> {
    payload: number;
  }

  export interface IDeleteSuccessAction extends Action<DatasetPolicyNotesActionType.DELETE_SUCCESS> {
    payload: number;
  }

  export interface IDeleteFailureAction extends Action<DatasetPolicyNotesActionType.DELETE_FAILURE> {
    payload: {
      id: number;
      error: any;
    };
    error: true;
  }

  export interface IDeleteResetAction extends Action<DatasetPolicyNotesActionType.DELETE_RESET> {
    payload: number;
  }
}

export type DatasetPolicyNotesActionUnion =
  | DatasetPolicyNotesAction.IBatchFetchRequestAction
  | DatasetPolicyNotesAction.IBatchFetchFailureAction
  | DatasetPolicyNotesAction.IBatchFetchSuccessAction
  | DatasetPolicyNotesAction.IBatchResetAction
  | DatasetPolicyNotesAction.IAddAction
  | DatasetPolicyNotesAction.IDeleteRequestAction
  | DatasetPolicyNotesAction.IDeleteSuccessAction
  | DatasetPolicyNotesAction.IDeleteFailureAction
  | DatasetPolicyNotesAction.IDeleteResetAction;
