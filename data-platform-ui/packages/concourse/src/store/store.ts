import { configureStore } from '@reduxjs/toolkit';
import {
  searchEntitiesReducer,
  searchFilterCountsReducer,
  searchFilterLookupReducer,
  searchResultReducer,
} from '../Search';
import type { ThunkExtraArgs } from 'redux-thunk';
import Thunk from 'redux-thunk';
import type { ConcourseStore } from './types';
import { NLSSError } from '@nlss/brain-trust';
import searchAPI from '../Search/states/searchAPI';

function createStore(): ConcourseStore {
  const dependencies: ThunkExtraArgs = {
    searchAPI,
    helpers: {
      isError: NLSSError.isNlSSError,
    },
  };

  return configureStore({
    reducer: {
      searchFilterLookup: searchFilterLookupReducer,
      searchResult: searchResultReducer,
      searchEntities: searchEntitiesReducer,
      searchFilterCounts: searchFilterCountsReducer,
    },
    devTools: true,
    middleware: [Thunk.withExtraArgument(dependencies)],
  });
}

export default createStore;
