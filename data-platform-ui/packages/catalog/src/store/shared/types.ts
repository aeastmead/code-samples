import { Entity } from '../../types';

export enum AsyncStateStatus {
  FETCHING = 'fetching',
  SUCCEEDED = 'succeed',
  FAILED = 'failed',
  UNINITIALIZED = 'uninitialized'
}

export interface AsyncState {
  status: AsyncStateStatus;
  error?: any;
}

export interface EntityState<T extends Entity<number>> {
  entities: {
    [id: number]: T;
  };

  /**
   * Loading statuses for each entity
   */
  statuses: {
    [id: number]: AsyncState;
  };
}

export interface IAsyncState {
  isFetching: boolean;
  didInvalidate: boolean;
  error?: any;
}

export interface ISnapshotAsyncState extends IAsyncState {
  isSnapshot: boolean;
}

export interface IEntityState<T extends Entity<number>> {
  entities: {
    [id: number]: T;
  };

  /**
   * Loading statuses for each entity
   */
  statuses: {
    [id: number]: IAsyncState;
  };
}


export interface ISaveState {
  saved: boolean;
  isSaving: boolean;
  didInvalidate: boolean;
  error?: any;
}

export interface IDeleteStatusState {
  deleted: boolean;
  isDeleting: boolean;
  didInvalidate: boolean;
  error?: any;
}

export enum EntityKind {
  RESOURCE = 'resource',
  DATASET = 'dataset',
  RESOURCE_FIELD = 'resourceField',
  DATASET_POLICY_NOTE = 'datasetPolicyNote',
  CLASSIFICATION_ANSWER = 'classificationAnswer'
}

export type EntityIdParams = {
  entityId: number;
};

export type EntityIdsParams = {
  entityIds: number[];
};

export interface IEntityWithBatchStatuesState<T extends Entity<number>> extends IEntityState<T> {
  batchStatuses: {
    [id: string]: IAsyncState;
  };
}

export const SaveStatus = {
  IDLE: 'IDLE',
  SAVING: 'SAVING',
  SAVED: 'SAVED',
  INVALIDATED: 'INVALIDATED'
} as const;

export type SaveStatus =
  | typeof SaveStatus.IDLE
  | typeof SaveStatus.SAVING
  | typeof SaveStatus.SAVED
  | typeof SaveStatus.INVALIDATED;
