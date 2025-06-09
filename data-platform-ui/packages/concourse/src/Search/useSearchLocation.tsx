import { useQueryString } from '../lib';
import { getLocationState } from './utils';
import { searchLocationService, SearchLocationState } from '@nlss/brain-trust';
import cloneDeep from 'lodash/cloneDeep';
import { useCallback } from 'react';

function useSearchLocation(): [
  searchLocationState: SearchLocationState,
  dispatch: (action: useSearchLocation.ChangeAction) => void
] {
  const [queryString, changeQueryString] = useQueryString();
  const locationState: SearchLocationState = getLocationState(queryString);

  function changeState(nextLocationState: SearchLocationState): void {
    const nextQueryString: string | undefined = searchLocationService.stringifyQS(nextLocationState);

    changeQueryString(nextQueryString);
  }

  return [
    locationState,
    useCallback(
      (action: useSearchLocation.ChangeAction): void => {
        const nextState: SearchLocationState = {
          filters: cloneDeep(locationState.filters),
          page: 1,
          pageSize: locationState.pageSize,
          q: locationState.q,
        };
        switch (action.type) {
          case 'changePage': {
            nextState.page = action.payload;
            break;
          }
          case 'changePageSize': {
            nextState.pageSize = action.payload;
            break;
          }
          case 'changeFilter': {
            nextState.filters = nextState.filters || {};
            delete nextState.filters[action.payload.id];
            if (action.payload.selectedValues !== undefined && action.payload.selectedValues.length > 0) {
              nextState.filters[action.payload.id] = [...action.payload.selectedValues];
            }
            break;
          }
        }
        changeState(nextState);
      },
      [locationState, changeQueryString]
    ),
  ];
}

namespace useSearchLocation {
  export type Dispatch = (action: ChangeAction) => void;
  export type ChangeAction = ChangeFilterAction | ChangePageAction | ChangePageSizeAction;
  export interface ChangeFilterAction {
    type: 'changeFilter';
    payload: {
      id: string;
      selectedValues?: string[] | undefined;
    };
  }

  export interface ChangePageAction {
    type: 'changePage';
    payload: number;
  }

  export interface ChangePageSizeAction {
    type: 'changePageSize';
    payload: number;
  }
}

export default useSearchLocation;
