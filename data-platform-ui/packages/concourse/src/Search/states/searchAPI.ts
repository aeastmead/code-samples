import { apiClient, gql, NLSSError, OptionValue } from '@nlss/brain-trust';
import type { SearchRequest } from './types';
import { SearchEntityType } from '../utils';

const SearchAPI = {
  async fetchFilterLookups(): Promise<SearchAPI.FilterLookup[] | NLSSError> {
    const gqlResp: Record<'filters', SearchAPI.FilterLookup[]> | undefined | NLSSError = await apiClient.request(
      gql`
        {
          filters: searchV3Facets {
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

    if (gqlResp === undefined) {
      return new NLSSError({
        code: 'CATALOG_API:REFERENCE_FAILED',
        message: 'Issue loading necessary page data. Please try again.',
      });
    }

    if (NLSSError.isNlSSError(gqlResp)) {
      return gqlResp;
    }

    return gqlResp.filters;
  },

  async fetchSearch(input: SearchRequest): Promise<SearchAPI.SearchResult | NLSSError> {
    const gqlResult: Record<'searchV3', SearchAPI.SearchResult> | undefined | NLSSError = await apiClient.request<
      Record<'searchV3', SearchAPI.SearchResult>,
      SearchRequest
    >(
      gql`
        query SearchV3($query: String, $selectedFilters: [SearchSelectedFilterInput!], $page: Int, $pageSize: Int) {
          searchV3(query: $query, selectedFilters: $selectedFilters, page: $page, pageSize: $pageSize) {
            totalCount
            entities {
              id
              alias
              entityType
              name
              description
              resourceTypeIds
              datasetCategoryName
              approverNames
            }

            filterCounts {
              id
              valueCounts {
                value
                count
              }
            }
          }
        }
      `,
      input
    );

    if (gqlResult === undefined) {
      return {
        totalCount: 0,
        filterCounts: null,
        entities: null,
      };
    }
    if (NLSSError.isNlSSError(gqlResult)) {
      return gqlResult;
    }

    return gqlResult.searchV3;
  },
};

interface SearchAPI {
  fetchFilterLookups(): Promise<SearchAPI.FilterLookup[] | NLSSError>;
  fetchSearch(input: SearchRequest): Promise<SearchAPI.SearchResult | NLSSError>;
}

namespace SearchAPI {
  export interface FilterLookup {
    id: string;
    label: string;
    options: OptionValue<string>[];
  }

  export interface SearchResult {
    entities: Entity[] | null;
    filterCounts: FilterCount[] | null;
    totalCount: number;
  }

  export interface Entity {
    id: number;
    entityType: SearchEntityType;
    name: string;
    alias: string | null;
    description: string | null;
    datasetCategoryName: string;
    approverNames: string[] | null;
    resourceTypeIds: number[] | null;
  }

  export interface FilterValueCount {
    value: string;
    count: number;
  }

  export interface FilterCount {
    id: string;
    valueCounts: FilterValueCount[];
  }
}

export default SearchAPI;
