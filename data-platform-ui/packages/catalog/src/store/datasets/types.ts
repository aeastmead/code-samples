/* eslint-disable @typescript-eslint/no-namespace */
import { Action } from 'redux';
import { CanRestrictState, Dataset } from '../../types';
import { IEntityState, ISnapshotAsyncState } from '../shared';

export interface IDatasetsState extends Omit<IEntityState<Dataset>, 'statuses'> {
  statuses: List<ISnapshotAsyncState>;
}

export enum DatasetsActionType {
  FETCH_REQUEST = 'Datasets/FetchRequest',
  FETCH_SUCCESS = 'Datasets/FetchSuccess',
  FETCH_FAILURE = 'Datasets/FetchFailure',
  RESET = 'Datasets/Reset',
  UPDATE = 'Dataset/Update',
  ADD = 'Datasets/Add'
}

export namespace DatasetsAction {
  export interface IFetchRequestAction extends Action<DatasetsActionType.FETCH_REQUEST> {
    payload: {
      datasetId: number;
      snapshot: boolean;
    };
  }

  export interface IFetchSuccessAction extends Action<DatasetsActionType.FETCH_SUCCESS> {
    payload: Dataset;
  }

  export interface IFetchFailureAction extends Action<DatasetsActionType.FETCH_FAILURE> {
    payload: {
      id: number;
      error: any;
    };
    error: true;
  }

  export interface IResetAction extends Action<DatasetsActionType.RESET> {
    payload: number;
  }

  export interface IUpdateAction extends Action<DatasetsActionType.UPDATE> {
    payload: IUpdatedDataset[];
  }

  export interface IAddAction extends Action<DatasetsActionType.ADD> {
    payload: Dataset[];
  }
}

export type DatasetsActionUnion =
  | DatasetsAction.IFetchRequestAction
  | DatasetsAction.IFetchSuccessAction
  | DatasetsAction.IFetchFailureAction
  | DatasetsAction.IResetAction
  | DatasetsAction.IUpdateAction
  | DatasetsAction.IAddAction;

export interface IUpdatedDataset {
  id: number;
  addResourceIds?: number[];
  addDatasetPolicyNoteIds?: number[];
  removeDatasetPolicyNoteIds?: number[];
  name?: string;
  description?: string;
  personIds?: number[];
  engineeringOwnerIds?: number[];
  dataOwnerIds?: number[];
  engineeringOwnerGroupId?: number;
  dataOwnerGroupId?: number;
  canEdit?: boolean;
  hasDataStore?: boolean;
  isRestricted?: boolean;
  canRestrictState?: CanRestrictState;
  /**
   * @TODO remove
   */
  canEditDevOwnership?: boolean;
}
