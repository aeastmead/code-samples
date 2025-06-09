import type { Action } from 'redux';
import type { IResource } from '../../types';
import type { IAsyncState, IEntityState } from '../shared';

export interface IResourcesState extends IEntityState<IResource> {
  batchStatus: {
    [key: string]: IAsyncState;
  };
}

export enum ResourcesActionType {
  BATCH_FETCH_REQUEST = 'Resources/BatchFetchRequest',
  BATCH_FETCH_SUCCESS = 'Resources/BatchFetchSuccess',
  BATCH_FETCH_FAILURE = 'Resources/BatchFetchFailure',
  BATCH_RESET = 'Resources/BatchReset',

  FETCH_REQUEST = 'Resources/FetchRequest',
  FETCH_SUCCESS = 'Resources/FetchSuccess',
  FETCH_FAILURE = 'Resources/FetchFailure',
  RESET = 'Resources/Reset',
  ADD = 'Resources/Add'
}

export namespace ResourcesAction {
  export interface IBatchFetchRequestAction extends Action<ResourcesActionType.BATCH_FETCH_REQUEST> {
    payload: {
      key: string;
    };
  }

  export interface IBatchFetchSuccessAction extends Action<ResourcesActionType.BATCH_FETCH_SUCCESS> {
    payload: {
      key: string;
      resources: IResource[] | undefined;
    };
  }

  export interface IBatchFetchFailureAction extends Action<ResourcesActionType.BATCH_FETCH_FAILURE> {
    payload: {
      key: string;
      error: any;
    };
    error: true;
  }

  export interface IBatchResetAction extends Action<ResourcesActionType.BATCH_RESET> {
    payload: {
      key: string;
    };
  }

  export interface IFetchRequestAction extends Action<ResourcesActionType.FETCH_REQUEST> {
    payload: number;
  }

  export interface IFetchSuccessAction extends Action<ResourcesActionType.FETCH_SUCCESS> {
    payload: IResource;
  }

  export interface IFetchFailedAction extends Action<ResourcesActionType.FETCH_FAILURE> {
    payload: {
      id: number;
      error: any;
    };
    error: true;
  }

  export interface IResetAction extends Action<ResourcesActionType.RESET> {
    payload: number;
  }

  export interface IAddAction extends Action<ResourcesActionType.ADD> {
    payload: IResource[];
  }
}

export type ResourcesActionUnion =
  | ResourcesAction.IBatchFetchRequestAction
  | ResourcesAction.IBatchFetchSuccessAction
  | ResourcesAction.IBatchFetchFailureAction
  | ResourcesAction.IBatchResetAction
  | ResourcesAction.IFetchRequestAction
  | ResourcesAction.IFetchSuccessAction
  | ResourcesAction.IFetchFailedAction
  | ResourcesAction.IAddAction;

export interface IUpdateResource extends Partial<IResource> {
  id: number;
}
