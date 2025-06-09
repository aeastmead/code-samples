import { DefaultRootState } from 'react-redux';
import { createSelector, ParametricSelector, Selector } from 'reselect';
import isNil from 'lodash/isNil';
import { AutoSelectOption } from '../../components/Form';
import { IPerson } from '../../types';
import { IPeopleSearchState, IPeopleState } from './types';

export const getEntities: Selector<DefaultRootState, State['entities']> = createSelector(
  (rootState: DefaultRootState) => rootState.people,
  (state: State) => state.entities
);

const selectSearchState: ParametricSelector<DefaultRootState, SearchParams, SearchState | undefined> = (
  state: DefaultRootState,
  props: SearchParams
) => state.people.searches[props.name];

export const makeSearchSelectors: () => SearchSelectors = () => {
  return {
    getLoading: createSelector(selectSearchState, (state: SearchState | undefined) => state?.isFetching === true),
    getNoResult: createSelector(selectSearchState, (state: SearchState | undefined) => state?.noResults === true),
    getOptions: createSelector(
      selectSearchState,
      getEntities,
      (state: SearchState | undefined, entities: { [id: number]: IPerson }) => {
        if (isNil(state) || isNil(state.ids)) {
          return [];
        }

        return state.ids.map((id: number) => ({ value: id, text: entities[id].name }));
      }
    )
  };
};

const selectPeople: ParametricSelector<DefaultRootState, { id?: number | number[] }, IPerson[] | undefined> = (
  rootState: DefaultRootState,
  props: { id?: number | number[] }
) => {
  const ids: number[] = !isNil(props.id) ? (Array.isArray(props.id) ? props.id : [props.id]) : [];

  if (ids.length <= 0) {
    return undefined;
  }
  const entities = getEntities(rootState);

  const result: IPerson[] = [];

  for (const uuid of ids) {
    if (!isNil(entities[uuid])) {
      result.push(entities[uuid]);
    }
  }
  return result.length > 0 ? result : undefined;
};

export const makeGetPersonSelector: () => GetPersonSelector = () =>
  createSelector(selectPeople, (people: IPerson[] = []) => (people.length > 0 ? people[0] : undefined));

export const makeGetPeopleSelector: () => GetPeopleSelector = () =>
  createSelector(selectPeople, (people: IPerson[] | undefined) => people);

type SearchParams = {
  name: string;
};

type State = IPeopleState;

type SearchState = IPeopleSearchState;

export type GetPersonSelector = ParametricSelector<DefaultRootState, { id?: number }, IPerson | undefined>;

export type GetPeopleSelector = ParametricSelector<DefaultRootState, { id: number | number[] }, IPerson[] | undefined>;

export type SearchSelectors = {
  getLoading: ParametricSelector<DefaultRootState, SearchParams, boolean>;
  getOptions: ParametricSelector<DefaultRootState, SearchParams, AutoSelectOption<number>[]>;
  getNoResult: ParametricSelector<DefaultRootState, SearchParams, boolean>;
};
