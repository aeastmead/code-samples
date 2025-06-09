import type { AsyncEntityState, AsyncStatusState } from '../../store';
import type { EntityState } from '@reduxjs/toolkit';
import type { SearchFilter } from '@nlss/brain-trust';
import type { SearchEntityType } from '../utils';

export interface SearchFilterLookupState extends AsyncEntityState<SearchFilterLookup> {}

export interface SearchFilterLookup {
  id: string;
  label: string;
  optionByValue: Record<string, SearchFilterLookup.Option>;
  optionValues: string[];
}

export namespace SearchFilterLookup {
  export interface Option {
    value: string;
    label: string;
  }
}

export interface SearchResultState extends AsyncStatusState {
  totalCount: number | undefined;
}

export interface SearchEntitiesState extends EntityState<SearchEntity> {}

export interface SearchFilterCountsState extends EntityState<SearchFilterCount> {}

export interface SearchRequest {
  pageSize: number;
  page: number;
  selectedFilters?: SearchRequest.SelectedFilter[];
  query?: string | undefined;
}

export namespace SearchRequest {
  export interface SelectedFilter {
    id: string;
    selectedValues: string[];
  }
}

export interface SearchEntity {
  id: number;
  entityType: SearchEntityType;
  name: string;
  alias: string | undefined;
  description: string | undefined;
  resourceTypeIds: number[] | undefined;
  category: string;
  approvers: string[] | undefined;
}

export interface SearchFilterCount {
  id: string;
  countByValue: Record<string, number>;
}

export interface SearchFilterWithCount extends Omit<SearchFilter, 'options'> {
  readonly options: SearchFilterWithCount.OptionWithCount[];
}

export namespace SearchFilterWithCount {
  export interface OptionWithCount extends SearchFilter.Option {
    count: number;
  }
}
