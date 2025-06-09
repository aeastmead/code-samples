import { NLSSErrorPOJO } from '@nlss/brain-trust';

import type { EntityState } from '@reduxjs/toolkit';

export const enum AsyncStatus {
  UNINITIALIZED = 'UNINITIALIZED',
  FETCHING = 'FETCHING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

export interface AsyncStatusState {
  status: AsyncStatus.UNINITIALIZED | AsyncStatus.FETCHING | AsyncStatus.SUCCEEDED | AsyncStatus.FAILED;
  error?: NLSSErrorPOJO;
}

export interface AsyncEntityState<TEntity> extends EntityState<TEntity>, AsyncStatusState {}

export type { EntityState } from '@reduxjs/toolkit';
