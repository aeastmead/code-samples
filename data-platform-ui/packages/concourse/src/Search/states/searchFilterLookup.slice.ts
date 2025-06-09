import { createEntityAdapter, EntityAdapter, createReducer, Draft, Reducer } from '@reduxjs/toolkit';
import type { DefaultThunkAction, DefaultThunkDispatch, ThunkExtraArgs } from 'redux-thunk';
import { SearchFilterLookup, SearchFilterLookupState } from './types';
import { NLSSError, NLSSErrorPOJO } from '@nlss/brain-trust';
import { AsyncStatus, AsyncStatusState } from '../../store';
import SearchAPI from './searchAPI';
import type { DefaultRootState, Selector, DefaultActionUnion } from 'react-redux';
import { createSelector, ParametricSelector } from 'reselect';

export const enum SearchFilterLookupActionType {
  FETCH_REQUEST = 'searchFilterLookup/FetchRequest',
  FETCH_SUCCEEDED = 'searchFilterLookup/FetchSucceeded',
  FETCH_FAILED = 'searchFilterLookup/FetchFailed',
}

const searchFilterLookupAdapter: EntityAdapter<SearchFilterLookup> = createEntityAdapter<SearchFilterLookup>();

const searchFilterLookupReducer: Reducer<SearchFilterLookupState, DefaultActionUnion> = createReducer(
  () => searchFilterLookupAdapter.getInitialState<AsyncStatusState>({ status: AsyncStatus.UNINITIALIZED }),
  builder => {
    builder
      .addCase(
        SearchFilterLookupActionType.FETCH_REQUEST,
        (): SearchFilterLookupState =>
          searchFilterLookupAdapter.getInitialState<AsyncStatusState>({
            status: AsyncStatus.FETCHING,
          })
      )
      .addCase(
        SearchFilterLookupActionType.FETCH_FAILED,
        (_: Draft<SearchFilterLookupState>, action: searchFilterLookupAction.FetchFailed): SearchFilterLookupState =>
          searchFilterLookupAdapter.getInitialState<AsyncStatusState>({
            status: AsyncStatus.FAILED,
            error: action.error,
          })
      )
      .addCase(
        SearchFilterLookupActionType.FETCH_SUCCEEDED,
        (_: Draft<SearchFilterLookupState>, action: searchFilterLookupAction.FetchSucceeded): SearchFilterLookupState =>
          searchFilterLookupAdapter.setAll<SearchFilterLookupState>(
            { status: AsyncStatus.SUCCEEDED, ids: [], entities: {} },
            action.payload
          )
      );
  }
);

export default searchFilterLookupReducer;

function fetchAsync(): DefaultThunkAction<Promise<void>> {
  return async (
    dispatch: DefaultThunkDispatch,
    getState: () => DefaultRootState,
    { searchAPI, helpers }: ThunkExtraArgs
  ) => {
    if (selectState(getState()).status === AsyncStatus.SUCCEEDED) {
      return;
    }
    dispatch(fetchRequest());

    const result: SearchAPI.FilterLookup[] | NLSSError = await searchAPI.fetchFilterLookups();

    const action: searchFilterLookupAction.FetchFailed | searchFilterLookupAction.FetchSucceeded = helpers.isError(
      result
    )
      ? fetchFailed(result)
      : fetchSucceeded(result);

    dispatch(action);
  };
}

function fetchRequest(): searchFilterLookupAction.FetchRequest {
  return { type: SearchFilterLookupActionType.FETCH_REQUEST, payload: undefined };
}

function fetchSucceeded(apiResult: SearchAPI.FilterLookup[]): searchFilterLookupAction.FetchSucceeded {
  const payload: SearchFilterLookup[] = [];

  for (const item of apiResult) {
    const lookup: SearchFilterLookup = {
      id: item.id,
      label: item.label,
      optionByValue: {},
      optionValues: [],
    };

    for (const option of item.options) {
      lookup.optionValues.push(option.value);
      lookup.optionByValue[option.value] = { value: option.value, label: option.label };
    }

    payload.push(lookup);
  }

  return { type: SearchFilterLookupActionType.FETCH_SUCCEEDED, payload };
}

function fetchFailed(apiError: NLSSError): searchFilterLookupAction.FetchFailed {
  return { type: SearchFilterLookupActionType.FETCH_FAILED, payload: undefined, error: apiError.toJSON() };
}

export const searchFilterLookupAction = {
  fetchAsync,
  fetchRequest,
  fetchSucceeded,
  fetchFailed,
};

export namespace searchFilterLookupAction {
  export interface FetchRequest {
    type: SearchFilterLookupActionType.FETCH_REQUEST;
    payload: undefined;
  }
  export interface FetchFailed {
    type: SearchFilterLookupActionType.FETCH_FAILED;
    payload: undefined;
    error: NLSSErrorPOJO;
  }
  export interface FetchSucceeded {
    type: SearchFilterLookupActionType.FETCH_SUCCEEDED;
    payload: SearchFilterLookup[];
  }
}

export type SearchFilterLookupActionUnion =
  | searchFilterLookupAction.FetchRequest
  | searchFilterLookupAction.FetchFailed
  | searchFilterLookupAction.FetchSucceeded;

const selectState: Selector<DefaultRootState, SearchFilterLookupState> = state => state.searchFilterLookup;

const makeGetById: () => ParametricSelector<DefaultRootState, string, SearchFilterLookup | undefined> = () =>
  createSelector(
    selectState,
    (_: DefaultRootState, entityId: string) => entityId,
    (state: SearchFilterLookupState, entityId: string) => state.entities[entityId]
  );

const getLoading: Selector<DefaultRootState, boolean> = createSelector(
  selectState,
  (state: SearchFilterLookupState) =>
    state.status === AsyncStatus.UNINITIALIZED || state.status === AsyncStatus.FETCHING
);

const getIds: Selector<DefaultRootState, string[] | undefined> = createSelector(
  selectState,
  (state: SearchFilterLookupState) => (state.ids.length > 0 ? (state.ids as string[]) : undefined)
);

export const searchFilterLookupSelectors = {
  getLoading,
  makeGetById,
  getIds,
};
