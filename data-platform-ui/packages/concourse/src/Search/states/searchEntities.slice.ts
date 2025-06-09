import {
  createEntityAdapter,
  createReducer,
  Draft,
  EntityAdapter,
  Reducer,
  EntitySelectors,
  createSelector,
} from '@reduxjs/toolkit';
import type { DefaultActionUnion, DefaultRootState, Selector } from 'react-redux';
import type { SearchEntitiesState, SearchEntity } from './types';
import { searchAction, SearchActionType } from './search.actions';

const searchEntitiesAdapter: EntityAdapter<SearchEntity> = createEntityAdapter();

const searchEntitiesReducer: Reducer<SearchEntitiesState, DefaultActionUnion> = createReducer(
  searchEntitiesAdapter.getInitialState,
  builder => {
    builder.addCase<SearchActionType.FETCH_SUCCEEDED, searchAction.FetchSucceeded>(
      SearchActionType.FETCH_SUCCEEDED,
      (state: Draft<SearchEntitiesState>, action: searchAction.FetchSucceeded) => {
        if (action.payload.entities !== undefined) {
          return searchEntitiesAdapter.setAll(state, action.payload.entities);
        }

        return emptyState(state);
      }
    );

    for (const otherType of [SearchActionType.RESET, SearchActionType.FETCH_FAILED, SearchActionType.FETCH_REQUEST]) {
      builder.addCase(otherType, emptyState);
    }
  }
);
function emptyState(prevState: Draft<SearchEntitiesState>): SearchEntitiesState {
  return prevState.ids.length > 0 ? searchEntitiesAdapter.getInitialState() : prevState;
}

export default searchEntitiesReducer;

const { selectAll }: EntitySelectors<SearchEntity, SearchEntitiesState> = searchEntitiesAdapter.getSelectors();

const getAll: Selector<DefaultRootState, SearchEntity[]> = createSelector(
  (state: DefaultRootState) => state.searchEntities,
  selectAll
);

export const searchEntitiesSelectors = {
  getAll,
};
