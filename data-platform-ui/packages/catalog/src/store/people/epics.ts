import { DefaultRootState } from 'react-redux';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { Observable, of } from 'rxjs';

import { catchError, filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { DependenciesContainer } from '../../api';
import { IPerson } from '../../types';
import { DefaultActionUnion } from '../types';
import peopleActions from './actions';
import { PeopleAction, PeopleActionType, PeopleActionUnion } from './types';

/**
 * Reacts to search request. Additional request with the same unique key, cancel any pending previous request.
 * @param {ActionsObservable<DefaultActionUnion>} action$
 * @param {StateObservable<DefaultRootState>} _
 * @param {PersonService} personService
 * @return {Observable<DefaultActionUnion>}
 */
export default function peopleSearchEpic$(
  action$: ActionsObservable<DefaultActionUnion>,
  _: StateObservable<DefaultRootState>,
  { personService }: DependenciesContainer
): Observable<DefaultActionUnion> {
  return action$.pipe(
    ofType<DefaultActionUnion, PeopleAction.ISearchRequestAction, PeopleActionType.SEARCH_REQUEST>(
      PeopleActionType.SEARCH_REQUEST
    ),
    mergeMap(({ payload }: PeopleAction.ISearchRequestAction) => {
      return personService.search$(payload.query).pipe(
        map((people: IPerson[] | undefined) => peopleActions.searchSuccess(payload.key, people)),
        catchError((error: any) => of(peopleActions.searchFailure(payload.key, error))),

        // Cancels request
        takeUntil(
          action$.pipe(
            ofType<
              DefaultActionUnion,
              PeopleAction.ISearchRequestAction | PeopleAction.ISearchResetAction,
              PeopleActionType.SEARCH_REQUEST | PeopleActionType.SEARCH_RESET
            >(PeopleActionType.SEARCH_REQUEST, PeopleActionType.SEARCH_RESET),
            filter((action: PeopleActionUnion) => {
              switch (action.type) {
                case PeopleActionType.SEARCH_RESET: {
                  return action.payload.key === payload.key;
                }
                case PeopleActionType.SEARCH_REQUEST: {
                  return action.payload.key === payload.key && action.payload.query !== payload.query;
                }
                default: {
                  return false;
                }
              }
            })
          )
        )
      );
    })
  );
}
