import type React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import { Link } from 'react-router-dom';
import { Breadcrumbs, Icon, Pagination } from '@bbnpm/bb-ui-framework';
import { appModuleConfigObj } from '@nlss/brain-trust';

const Wrapper: StyledComponent<'div', DefaultTheme> = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 30px 1fr;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.large};

  .nlss-searchHeader {
    &__crumbs {
      grid-row: 1/2;
      grid-column: 1/3;
    }

    &__title {
      grid-row: 2/3;
      grid-column: 1/2;
      margin: unset;
      line-height: unset;
      font-size: ${({ theme }: { theme: DefaultTheme }) => theme.fontSizes.xxxlarge};
      font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.fontWeights.medium};
      padding: unset;
    }
    &__pageInfo {
      grid-row: 2/3;
      grid-column: 2/3;
      margin: unset;
      display: flex;
      justify-content: flex-end;
    }

    &__query {
      font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.fontWeights.normal};
      font-style: italic;
      padding-left: 8px;
    }
  }
`;

function SearchHeader({ className, page, pageSize, totalCount = -1, query, ...rest }: SearchHeader.Props) {
  return (
    <Wrapper {...rest} className={cn('nlss-searchHeader', className)}>
      <Breadcrumbs className="nlss-searchHeader__crumbs">
        <Breadcrumbs.Link>
          <Link to="/">
            <Icon name="home" title="Home" />
          </Link>
        </Breadcrumbs.Link>
        <Breadcrumbs.Link>
          <Link to={appModuleConfigObj.catalog.path}>{appModuleConfigObj.catalog.displayName}</Link>
        </Breadcrumbs.Link>
        {query && <Breadcrumbs.Link>Search</Breadcrumbs.Link>}
      </Breadcrumbs>
      {query ? (
        <h2 className="nlss-searchHeader__title">
          Search results&nbsp;&nbsp;<span className="nlss-searchHeader__query">&ldquo;{query}&rdquo;</span>
        </h2>
      ) : (
        <h2 className="nlss-searchHeader__title">Explore Data Catalog</h2>
      )}
      {totalCount > 0 && (
        <Pagination.PageInfo
          pageSize={pageSize}
          currentPage={page}
          totalItems={totalCount}
          itemLabel="items"
          className="nlss-searchHeader__pageInfo"
        />
      )}
    </Wrapper>
  );
}

namespace SearchHeader {
  export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    pageSize: number;
    page: number;
    totalCount?: number;
    query?: string;
  }
}

export default SearchHeader;
