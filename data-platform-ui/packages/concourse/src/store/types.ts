import type { Store } from 'redux';
import type {
  SearchActionUnion,
  SearchEntitiesState,
  SearchFilterCountsState,
  SearchFilterLookupActionUnion,
  SearchFilterLookupState,
  SearchResultState,
} from '../Search';
import { SearchAPI } from '../Search';
import { NLSSError } from '@nlss/brain-trust';

export type ConcourseStore = Store<ConcourseRootState, ConcourseActionUnion>;

export type ConcourseActionUnion = SearchFilterLookupActionUnion | SearchActionUnion;
export interface ConcourseRootState {
  searchFilterLookup: SearchFilterLookupState;
  searchEntities: SearchEntitiesState;
  searchFilterCounts: SearchFilterCountsState;
  searchResult: SearchResultState;
}
export interface ConcourseRootAPI {
  searchAPI: SearchAPI;
  helpers: {
    isError(value: any): value is NLSSError;
  };
}
