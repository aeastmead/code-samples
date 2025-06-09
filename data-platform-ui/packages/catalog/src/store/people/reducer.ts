import cloneDeep from 'lodash/cloneDeep';
import { IPerson } from '../../types';
import { PeopleActionType, PeopleActionUnion, IPeopleState } from './types';

const initialState: State = {
  entities: {},
  searches: {}
};

export default function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case PeopleActionType.ADD: {
      const { people } = action.payload;
      if (people.length <= 0) {
        return state;
      }
      const newState: State = cloneDeep(state);
      return people.reduce((accum: State, person: IPerson) => {
        accum.entities[person.id] = { ...person };
        return accum;
      }, newState);
    }
    case PeopleActionType.SEARCH_REQUEST: {
      const key = action.payload.key;

      const newState: State = cloneDeep(state);

      newState.searches[key] = {
        noResults: false,
        isFetching: true,
        didInvalidate: false
      };

      return newState;
    }
    case PeopleActionType.SEARCH_SUCCESS: {
      const { people, key } = action.payload;

      const { entities, searches }: State = cloneDeep(state);
      const ids: number[] = [];

      for (const person of people) {
        entities[person.id] = { ...person };
        ids.push(person.id);
      }

      searches[key] = {
        ids,
        noResults: ids.length <= 0,
        isFetching: false,
        didInvalidate: false
      };
      return {
        entities,
        searches
      };
    }
    case PeopleActionType.SEARCH_FAILURE: {
      const { key, error } = action.payload;

      const newState: State = cloneDeep(state);
      newState.searches[key] = {
        noResults: false,
        isFetching: false,
        didInvalidate: true,
        error
      };

      return newState;
    }
    case PeopleActionType.SEARCH_RESET: {
      const key = action.payload.key;

      if (state.searches[key] === undefined) {
        return state;
      }

      const newState: State = cloneDeep(state);

      delete newState.searches[key];

      return newState;
    }
    default: {
      return state;
    }
  }
}

type State = IPeopleState;

type Action = PeopleActionUnion;
