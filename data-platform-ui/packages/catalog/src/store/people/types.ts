/* eslint-disable @typescript-eslint/no-namespace */
import type { Action } from 'redux';
import type { IPerson } from '../../types';
import type { IAsyncState, IEntityState } from '../shared';

export interface IPeopleState extends Pick<IEntityState<IPerson>, 'entities'> {
  searches: {
    [key: string]: IPeopleSearchState;
  };
}

export interface IPeopleSearchState extends IAsyncState {
  ids?: number[];
  noResults: boolean;
}

export const enum PeopleActionType {
  ADD = 'People/Add',

  SEARCH_REQUEST = 'People/SearchRequest',
  SEARCH_SUCCESS = 'People/SearchSuccess',
  SEARCH_FAILURE = 'People/SearchFailure',
  SEARCH_RESET = 'People/SearchReset'
}

export namespace PeopleAction {
  export interface IAddAction extends Action<PeopleActionType.ADD> {
    payload: {
      people: IPerson[];
    };
  }

  export interface ISearchRequestAction extends Action<PeopleActionType.SEARCH_REQUEST> {
    payload: {
      key: string;
      query: string;
    };
  }

  export interface ISearchSuccessAction extends Action<PeopleActionType.SEARCH_SUCCESS> {
    payload: {
      key: string;
      people: IPerson[];
    };
  }

  export interface ISearchFailureAction extends Action<PeopleActionType.SEARCH_FAILURE> {
    payload: {
      key: string;
      error: any;
    };

    error: true;
  }

  export interface ISearchResetAction extends Action<PeopleActionType.SEARCH_RESET> {
    payload: {
      key: string;
    };
  }
}

export type PeopleActionUnion =
  | PeopleAction.IAddAction
  | PeopleAction.ISearchRequestAction
  | PeopleAction.ISearchSuccessAction
  | PeopleAction.ISearchFailureAction
  | PeopleAction.ISearchResetAction;
