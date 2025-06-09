/* eslint-disable @typescript-eslint/no-namespace */
import { Action } from 'redux';
import { IResourceField } from '../../types';
import { IEntityState } from '../shared';

export interface IResourceFieldsState extends Omit<IEntityState<IResourceField>, 'statuses'> {}

export enum ResourceFieldsActionType {
  ADD = 'ResourceFields/Add',
  RESET = 'ResourceFields/Reset'
}

export namespace ResourceFieldsAction {
  export interface IAddAction extends Action<ResourceFieldsActionType.ADD> {
    payload: IResourceField[];
  }

  export interface IResetAction extends Action<ResourceFieldsActionType.RESET> {}
}

export type ResourceFieldsActionUnion = ResourceFieldsAction.IAddAction | ResourceFieldsAction.IResetAction;
