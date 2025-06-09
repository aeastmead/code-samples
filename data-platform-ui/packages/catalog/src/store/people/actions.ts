import castArray from 'lodash/castArray';
import isNil from 'lodash/isNil';
import { IPerson } from '../../types';
import { PeopleAction, PeopleActionType } from './types';

class PeopleActions implements IPeopleActions {
  constructor() {
    this.add = this.add.bind(this);
  }

  public add(personOrPeople: IPerson | IPerson[] | undefined): PeopleAction.IAddAction {
    const people: IPerson[] = !isNil(personOrPeople) ? castArray(personOrPeople) : [];
    return {
      type: PeopleActionType.ADD,
      payload: {
        people
      }
    };
  }

  public searchFailure(key: string, error: any): PeopleAction.ISearchFailureAction {
    return {
      type: PeopleActionType.SEARCH_FAILURE,
      payload: {
        key,
        error
      },
      error: true
    };
  }

  public searchRequest(key: string, searchQuery: string): PeopleAction.ISearchRequestAction {
    return {
      type: PeopleActionType.SEARCH_REQUEST,
      payload: {
        key,
        query: searchQuery
      }
    };
  }

  public searchSuccess(key: string, people: IPerson[] | undefined): PeopleAction.ISearchSuccessAction {
    return {
      type: PeopleActionType.SEARCH_SUCCESS,
      payload: {
        key,
        people: people || []
      }
    };
  }

  public searchReset(key: string): PeopleAction.ISearchResetAction {
    return {
      type: PeopleActionType.SEARCH_RESET,
      payload: {
        key
      }
    };
  }
}

const peopleActions: IPeopleActions = new PeopleActions();

export default peopleActions;

export interface IPeopleActions {
  add(personOrPeople: IPerson | IPerson[] | undefined): PeopleAction.IAddAction;
  searchRequest(key: string, searchQuery: string): PeopleAction.ISearchRequestAction;
  searchSuccess(key: string, people: IPerson[] | undefined): PeopleAction.ISearchSuccessAction;

  searchFailure(key: string, error: any): PeopleAction.ISearchFailureAction;

  searchReset(key: string): PeopleAction.ISearchResetAction;
}
