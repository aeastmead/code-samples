import { createEntityAdapter, createReducer, Draft, EntityAdapter, Reducer } from '@reduxjs/toolkit';
import { DefaultActionUnion, DefaultRootState } from 'react-redux';
import type { SearchFilterCount, SearchFilterCountsState, SearchFilterLookup, SearchFilterWithCount } from './types';
import { searchAction, SearchActionType } from './search.actions';
import { createSelector, ParametricSelector } from 'reselect';
import { searchFilterLookupSelectors } from './searchFilterLookup.slice';

const searchFilterCountsAdapter: EntityAdapter<SearchFilterCount> = createEntityAdapter();

const searchFilterCountsReducer: Reducer<SearchFilterCountsState, DefaultActionUnion> = createReducer(
  searchFilterCountsAdapter.getInitialState(),
  builder => {
    builder.addCase(
      SearchActionType.FETCH_SUCCEEDED,
      (prevState: Draft<SearchFilterCountsState>, action: searchAction.FetchSucceeded) => {
        return action.payload.filterCounts !== undefined
          ? searchFilterCountsAdapter.setAll(prevState, action.payload.filterCounts)
          : emptyState(prevState);
      }
    );

    for (const otherType of [SearchActionType.RESET, SearchActionType.FETCH_FAILED, SearchActionType.FETCH_REQUEST]) {
      builder.addCase(otherType, emptyState);
    }
  }
);

function emptyState(prevState: Draft<SearchFilterCountsState>): SearchFilterCountsState {
  return prevState.ids.length > 0 ? searchFilterCountsAdapter.getInitialState() : prevState;
}

export default searchFilterCountsReducer;

const makeGetById: () => ParametricSelector<DefaultRootState, string, SearchFilterCount | undefined> = () =>
  createSelector(
    (state: DefaultRootState) => state.searchFilterCounts,

    (_: DefaultRootState, entityId: string) => entityId,
    (state: SearchFilterCountsState, entityId: string) => state.entities[entityId]
  );

const makeGetWithCountById: () => ParametricSelector<
  DefaultRootState,
  string,
  SearchFilterWithCount | undefined
> = () =>
  createSelector(
    searchFilterLookupSelectors.makeGetById(),
    makeGetById(),
    (filterLookup: SearchFilterLookup | undefined, filterCount: SearchFilterCount | undefined) => {
      if (filterLookup === undefined) return undefined;
      const countByValue: Record<string, number> = filterCount !== undefined ? filterCount.countByValue : {};
      const options: SearchFilterWithCount.OptionWithCount[] = [];

      for (const optValue of filterLookup.optionValues) {
        const count: number = countByValue[optValue] !== undefined ? countByValue[optValue] : 0;

        options.push({
          value: optValue,
          label: filterLookup.optionByValue[optValue].label,
          count,
        });
      }

      return {
        id: filterLookup.id,
        label: filterLookup.label,
        options,
      };
    }
  );

export const searchFilterCountsSelectors = {
  makeGetById,
  makeGetWithCountById,
};

export namespace searchFilterCountsSelectors {
  export type GetWithCountById = ParametricSelector<DefaultRootState, string, SearchFilterWithCount | undefined>;
}
