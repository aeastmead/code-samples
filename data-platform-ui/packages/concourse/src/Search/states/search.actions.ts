import { NLSSError, NLSSErrorPOJO, nlssUtils, SearchLocationState } from '@nlss/brain-trust';
import type { DefaultThunkAction, DefaultThunkDispatch, ThunkExtraArgs } from 'redux-thunk';
import SearchAPI from './searchAPI';
import { SearchEntity, SearchFilterCount, SearchRequest } from './types';
import { DefaultRootState } from 'react-redux';

function fetchAsync(locationState: SearchLocationState): DefaultThunkAction<Promise<void>> {
  const apiRequest: SearchRequest = createAPIRequest(locationState);
  return async (dispatch: DefaultThunkDispatch, _: () => DefaultRootState, { searchAPI, helpers }: ThunkExtraArgs) => {
    dispatch(fetchRequest());

    const resultOrError: SearchAPI.SearchResult | NLSSError = await searchAPI.fetchSearch(apiRequest);

    const action: searchAction.FetchSucceeded | searchAction.FetchFailed = helpers.isError(resultOrError)
      ? fetchFailed(resultOrError)
      : fetchSucceeded(resultOrError);

    dispatch(action);
  };
}

export enum SearchActionType {
  FETCH_REQUEST = 'search/FetchRequest',
  FETCH_SUCCEEDED = 'search/FetchSucceeded',
  FETCH_FAILED = 'search/FetchFailed',
  RESET = 'search/Reset',
}

function createAPIRequest(state: SearchLocationState): SearchRequest {
  const request: SearchRequest = {
    page: state.page,
    pageSize: state.pageSize,
    query: state.q,
  };

  const selectedFilters: SearchRequest.SelectedFilter[] = [];

  for (const filterId in state.filters) {
    if (state.filters[filterId].length <= 0) {
      continue;
    }
    selectedFilters.push({
      id: filterId,
      selectedValues: [...state.filters[filterId]],
    });
  }
  if (selectedFilters.length > 0) {
    request.selectedFilters = selectedFilters;
  }
  return request;
}

function fetchRequest(): searchAction.FetchRequest {
  return {
    type: SearchActionType.FETCH_REQUEST,
    payload: undefined,
  };
}
function fetchSucceeded(apiResult: SearchAPI.SearchResult): searchAction.FetchSucceeded {
  if (apiResult.totalCount <= 0) {
    return {
      type: SearchActionType.FETCH_SUCCEEDED,
      payload: {
        totalCount: 0,
        entities: undefined,
        filterCounts: undefined,
      },
    };
  }

  let entities: SearchEntity[] | undefined;

  if (apiResult.entities !== null && apiResult.entities.length > 0) {
    entities = apiResult.entities.map(
      (apiEntity: SearchAPI.Entity): SearchEntity => ({
        id: apiEntity.id,
        entityType: apiEntity.entityType,
        name: apiEntity.name,
        alias: nlssUtils.stripToUndefined(apiEntity.alias),
        description: nlssUtils.stripToUndefined(apiEntity.description),
        resourceTypeIds:
          apiEntity.resourceTypeIds !== null && apiEntity.resourceTypeIds.length > 0
            ? apiEntity.resourceTypeIds
            : undefined,
        category: apiEntity.datasetCategoryName,
        approvers:
          apiEntity.approverNames !== null && apiEntity.approverNames.length > 0 ? apiEntity.approverNames : undefined,
      })
    );
  }

  let filterCounts: SearchFilterCount[] | undefined;
  if (apiResult.filterCounts !== null && apiResult.filterCounts.length > 0) {
    filterCounts = apiResult.filterCounts.map(
      (filterCount: SearchAPI.FilterCount): SearchFilterCount => ({
        id: filterCount.id,
        countByValue: filterCount.valueCounts.reduce(
          (accum: Record<string, number>, valueCount: SearchAPI.FilterValueCount) => {
            accum[valueCount.value] = valueCount.count;
            return accum;
          },
          {}
        ),
      })
    );
  }

  return {
    type: SearchActionType.FETCH_SUCCEEDED,
    payload: {
      totalCount: apiResult.totalCount,
      filterCounts,
      entities,
    },
  };
}
function fetchFailed(error: NLSSError): searchAction.FetchFailed {
  return {
    type: SearchActionType.FETCH_FAILED,
    payload: undefined,
    error: error.toJSON(),
  };
}
function reset(): searchAction.Reset {
  return {
    type: SearchActionType.RESET,
    payload: undefined,
  };
}

export const searchAction = {
  fetchRequest,
  fetchSucceeded,
  fetchFailed,
  reset,
  fetchAsync,
};

export namespace searchAction {
  export interface FetchRequest {
    type: SearchActionType.FETCH_REQUEST;
    payload: undefined;
  }

  export interface FetchSucceeded {
    type: SearchActionType.FETCH_SUCCEEDED;
    payload: {
      totalCount: number;
      entities: SearchEntity[] | undefined;
      filterCounts: SearchFilterCount[] | undefined;
    };
  }

  export interface FetchFailed {
    type: SearchActionType.FETCH_FAILED;
    payload: undefined;
    error: NLSSErrorPOJO;
  }

  export interface Reset {
    type: SearchActionType.RESET;
    payload: undefined;
  }
}

export type SearchActionUnion =
  | searchAction.FetchRequest
  | searchAction.FetchSucceeded
  | searchAction.FetchFailed
  | searchAction.Reset;
