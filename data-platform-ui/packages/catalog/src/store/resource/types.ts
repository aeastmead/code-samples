/* eslint-disable @typescript-eslint/no-namespace */
import { Action } from 'redux';
import { IResourceField, IResourceWithFields } from '../../types';

export enum ResourceActionType {
  FETCH_REQUEST = 'Resource/FetchRequest',
  FETCH_SUCCESS = 'Resource/FetchSuccess',
  FETCH_FAILURE = 'Resource/FetchFailure',
  RESET = 'Resource/Reset',
  UPDATE_FIELD = 'Resource/UpdateField',
  UPDATE = 'Resource/Update'
}

export interface IResourceState {
  id: number | undefined;
  data?: IResourceWithFields;
  errorMsg?: string;
  error: boolean;
  isFetching: boolean;
  didInvalidate: boolean;
}

export namespace ResourceAction {
  export interface IFetchResourceAction extends Action<ResourceActionType.FETCH_REQUEST> {
    payload: { id: number };
  }
  export interface IFetchSuccessAction extends Action<ResourceActionType.FETCH_SUCCESS> {
    payload: IResourceWithFields;
  }
  export interface IFetchFailureAction extends Action<ResourceActionType.FETCH_FAILURE> {
    payload: {
      id: number;
      error: string;
    };
    error: boolean;
  }
  export interface IResetAction extends Action<ResourceActionType.RESET> {
    payload: {
      id: number;
    };
    error: boolean;
  }

  export interface IUpdateFieldAction extends Action<ResourceActionType.UPDATE_FIELD> {
    payload: IResourceField;
  }

  export interface IUpdate extends Action<ResourceActionType.UPDATE> {
    payload: IResourceWithFields;
  }
}

export type ResourceActionUnion =
  | ResourceAction.IFetchResourceAction
  | ResourceAction.IFetchSuccessAction
  | ResourceAction.IFetchFailureAction
  | ResourceAction.IResetAction
  | ResourceAction.IUpdateFieldAction
  | ResourceAction.IUpdate;
