import React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import { DefaultRootState, Selector, useDispatch, useSelector } from 'react-redux';
import { ProgressOverlay } from '@bbnpm/bb-ui-framework';
import isEmpty from 'lodash/isEmpty';
import { appModuleConfigObj } from '@nlss/brain-trust';
import { searchAction, searchFilterLookupAction, searchFilterLookupSelectors, searchResultSelectors } from './states';
import SearchFilterGroup from './SearchFilterGroup';
import SearchCardGrid from './SearchCardGrid';
import SearchPagination from './SearchPagination';

import useSearchLocation from './useSearchLocation';
import { createSelector } from '@reduxjs/toolkit';
import SearchHeader from './SearchHeader';
import SearchNoResult from './SearchNoResult';

const Container: StyledComponent<
  React.FunctionComponent<ProgressOverlay.Props>,
  DefaultTheme,
  ProgressOverlay.Props
> = styled(ProgressOverlay)`
  .nlss-search {
    &__content {
      display: grid;
      grid-template-columns: 250px 1fr;
      grid-template-rows: 120px 1fr;
      grid-auto-flow: column;
      grid-column-gap: 120px;
      grid-row-gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.large};
      width: 100%;
      height: 100%;
      padding: ${({ theme }: { theme: DefaultTheme }) =>
        `${theme.spacingSizes.medium} 64px ${theme.spacingSizes.xlarge}`};
    }
    &__fitlers {
      grid-column: 1/2;
      grid-row: 2/3;
      display: flex;
      flex-direction: column;
    }

    &__main {
      grid-column: 2/3;
      grid-row: 2/3;
      display: flex;
      flex-direction: column;
    }

    &__header {
      grid-column: 1/3;
      grid-row: 1/2;
    }
    &__paging {
      padding-top: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.large};
    }
  }

  .nlss-search-filters__filterGroup:not(:first-child) {
    padding-top: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.large};
  }
`;

type StateProps = {
  loading: boolean;
  filterGroupIds: string[] | undefined;
  totalCount: number | undefined;
  noResults: boolean;
};

const getLocalValues: Selector<DefaultRootState, StateProps> = createSelector(
  searchFilterLookupSelectors.getLoading,
  searchResultSelectors.getIsLoading,
  searchFilterLookupSelectors.getIds,
  searchResultSelectors.getTotalCount,
  searchResultSelectors.getNoResults,
  (
    lookupLoading: boolean,
    resultLoading: boolean,
    filterGroupIds: string[] | undefined,
    totalCount: number | undefined,
    noResults: boolean
  ) => ({
    loading: lookupLoading || resultLoading,
    totalCount,
    filterGroupIds,
    noResults,
  })
);

const Search = React.memo(function InnerSearch({ className, ...rest }: Search.Props) {
  const dispatch = useDispatch();
  const [locationState, locationDispatch] = useSearchLocation();

  const { loading, totalCount, filterGroupIds, noResults } = useSelector(getLocalValues);

  React.useEffect(() => {
    dispatch(searchFilterLookupAction.fetchAsync());
  }, []);

  React.useEffect(() => {
    dispatch(searchAction.fetchAsync(locationState));
  }, [locationState.q, locationState.filters, locationState.page]);

  React.useEffect(() => {
    document.title = `NLSS | ${
      locationState.q !== undefined ? `Search - ${locationState.q}` : appModuleConfigObj.catalog.displayName
    }`;
  }, [locationState.q]);

  return (
    <Container {...rest} active={loading} label="Loading..." className={cn('nlss-search', className)}>
      <div className="nlss-search__content">
        <SearchHeader
          page={locationState.page}
          pageSize={locationState.pageSize}
          totalCount={totalCount}
          query={locationState.q}
          className="nlss-search__header"
        />

        <div className="nlss-search__filters nlss-search-filters">
          {filterGroupIds &&
            filterGroupIds.map((filterGroupId: string) => (
              <SearchFilterGroup
                key={filterGroupId}
                className="nlss-search-filters__filterGroup"
                entityId={filterGroupId}
              />
            ))}
        </div>

        <div className={cn('nlss-search__main', { ['nlss-search__main--empty']: noResults })}>
          {noResults ? (
            <SearchNoResult
              query={locationState.q}
              activeFilters={locationState.filters !== undefined && !isEmpty(locationState.filters)}
            />
          ) : (
            <>
              <SearchCardGrid />
              <SearchPagination
                page={locationState.page}
                pageSize={locationState.pageSize}
                totalCount={totalCount}
                onPageChange={(nextPage: number) => {
                  locationDispatch({ type: 'changePage', payload: nextPage });
                }}
                onPageSizeChange={(nextPageSize: number) => {
                  locationDispatch({ type: 'changePageSize', payload: nextPageSize });
                }}
                className="nlss-search__paging"
              />
            </>
          )}
        </div>
      </div>
    </Container>
  );
});

namespace Search {
  export interface Props extends Omit<ProgressOverlay.Props, 'active' | 'label'> {
    className?: string;
  }
}

export default Search;
