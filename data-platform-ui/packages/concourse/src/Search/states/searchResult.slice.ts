import { SearchResultState } from './types';
import { AsyncStatus } from '../../store';
import { createReducer, createSelector, Draft, Reducer } from '@reduxjs/toolkit';
import type { DefaultActionUnion, DefaultRootState, Selector } from 'react-redux';
import { searchAction, SearchActionType } from './search.actions';

const initialState: SearchResultState = {
  status: AsyncStatus.UNINITIALIZED,
  totalCount: undefined,
};

const searchResultSlice: Reducer<SearchResultState, DefaultActionUnion> = createReducer(initialState, builder => {
  builder
    .addCase<SearchActionType.FETCH_REQUEST, searchAction.FetchRequest>(SearchActionType.FETCH_REQUEST, () => ({
      status: AsyncStatus.FETCHING,
      totalCount: undefined,
    }))
    .addCase<SearchActionType.FETCH_SUCCEEDED, searchAction.FetchSucceeded>(
      SearchActionType.FETCH_SUCCEEDED,
      (__: Draft<SearchResultState>, action: searchAction.FetchSucceeded) => ({
        totalCount: action.payload.totalCount,
        status: AsyncStatus.SUCCEEDED,
      })
    )
    .addCase(
      SearchActionType.FETCH_FAILED,
      (_: Draft<SearchResultState>, action: searchAction.FetchFailed): SearchResultState => ({
        totalCount: undefined,
        status: AsyncStatus.FAILED,
        error: action.error,
      })
    )
    .addCase<SearchActionType.RESET, searchAction.Reset>(SearchActionType.RESET, () => ({
      status: AsyncStatus.UNINITIALIZED,
      totalCount: undefined,
    }));
});

export default searchResultSlice;
const selectState: Selector<DefaultRootState, SearchResultState> = (state: DefaultRootState) => state.searchResult;

const selectStatus: Selector<DefaultRootState, AsyncStatus> = createSelector(
  selectState,
  (state: SearchResultState) => state.status
);
const getTotalCount: Selector<DefaultRootState, number | undefined> = createSelector(
  selectState,
  (state: SearchResultState) => state.totalCount
);

const getNoResults: Selector<DefaultRootState, boolean> = createSelector(
  selectStatus,
  getTotalCount,
  (status: AsyncStatus, totalCount: number = -1) => status === AsyncStatus.SUCCEEDED && totalCount <= 0
);

export const searchResultSelectors = {
  getIsLoading: createSelector(
    selectStatus,
    (status: AsyncStatus) => status === AsyncStatus.UNINITIALIZED || status === AsyncStatus.FETCHING
  ),
  getTotalCount,
  getNoResults,
};
