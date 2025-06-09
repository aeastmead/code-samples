import { apiClient, gql } from '../apiClient';
import { SearchBarFormModel, SearchFilter, SearchLocationState } from './search.types';
import cloneDeep  from 'lodash/cloneDeep';
import isNil from 'lodash/isNil';
import searchLocationService from './searchLocation.service';
import { NLSSError } from '../errors';
import { appModuleConfigObj } from '../appModules.configs';

let SearchBarStorage: SearchBarStorage = { loaded: false, id: '', label: '', options: [] };

interface SearchBarStorage extends SearchFilter {
  loaded: boolean;
  options: SearchFilter['options'];
}

function setEntityTypeFilter(filter: SearchFilter): void {
  SearchBarStorage = {
    loaded: true,
    id: filter.id,
    label: filter.label,
    options: Object.seal(cloneDeep(filter.options)),
  };
}

async function fetchEntityTypeFilter(): Promise<SearchFilter> {
  const response: Record<'facet', SearchFilter> | undefined | NLSSError = await apiClient.request<
    Record<'facet', SearchFilter>
  >(
    gql`
      query {
        facet: searchV3EntityTypeFacet {
          id
          label
          options {
            value
            label
          }
        }
      }
    `
  );
  if (response === undefined) {
    throw new NLSSError({ message: 'EntityType filters request failed' });
  }
  if (NLSSError.isNlSSError(response)) {
    throw response;
  }

  setEntityTypeFilter(response.facet);

  return response.facet;
}

function pluckEntityTypeFilter(state: SearchLocationState | undefined): string | undefined {
  if (state === undefined) return undefined;

  const { filters } = state;

  return filters[SearchBarStorage.id] !== undefined && filters[SearchBarStorage.id].length === 1
    ? filters[SearchBarStorage.id][0]
    : undefined;
}

function createSearchResultPath(values?: SearchBarFormModel | undefined): string {
  const state: SearchLocationState = searchLocationService.getInitLocationState();

  if (!isNil(values)) {
    state.q = values.q;

    if (values.entityType !== undefined) {
      state.filters = { [SearchBarStorage.id]: [values.entityType] };
    }
  }

  return searchLocationService.createSearchResultPath(state);
}

function goToResultPage(values?: SearchBarFormModel | undefined): void {
  const url: string = createSearchResultPath(values);

  window && window.location && window.location.assign(url);
}

const DASHBOARD_LABEL = appModuleConfigObj.dashboard.displayName + ' (under construction)';

const searchBarService = {
  fetchEntityTypeFilter,
  pluckEntityTypeFilter,
  goToResultPage,
  createSearchResultPath,
  get entityTypeOptions(): SearchFilter.Option[] {
    return SearchBarStorage.options;
  },
  get entityTypeLabel(): string {
    return SearchBarStorage.label;
  },
  DASHBOARD_LABEL,
};

export default searchBarService;
