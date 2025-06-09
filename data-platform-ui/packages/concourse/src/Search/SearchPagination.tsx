import type React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import { Pagination } from '@bbnpm/bb-ui-framework';
import { SEARCH_PAGE_SIZES } from '@nlss/brain-trust';

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;

  .nlss-pagination {
    &____perPage {
      grid-column: 1/2;
      grid-row: 1/2;
    }
    &__pageInfo {
      grid-column: 3/4;
      grid-row: 1/2;
      margin: unset;
      display: flex;
      justify-content: flex-end;
    }
    &__control {
      grid-column: 2/3;
      grid-row: 1/2;
    }
  }
`;

/**
 * Fixing typing for PageSize component. Prevents mutation as well
 * @type {number[]}
 */
const PAGE_SIZE_OPTIONS: number[] = [...SEARCH_PAGE_SIZES];

function SearchPagination({
  className,
  pageSize,
  totalCount,
  page,
  onPageChange,
  onPageSizeChange,
  ...rest
}: SearchPagination.Props) {
  const disablePaging = totalCount === undefined || pageSize >= totalCount;
  return (
    <Container {...rest} className={cn('nlss-pagination', className)}>
      {totalCount && (
        <>
          <Pagination.PageSize
            className="nlss-pagination__perPage"
            options={PAGE_SIZE_OPTIONS}
            pageSize={pageSize}
            onPageSizeChange={(nextPageSize: string | number) => {
              !disablePaging && onPageSizeChange && onPageSizeChange(+nextPageSize);
            }}
            label="Per Page"
          />
          <Pagination.Paginator
            className="nlss-pagination__control"
            pageSize={pageSize}
            currentPage={page}
            totalItems={totalCount}
            disabled={disablePaging}
            onPageChange={(nextPage: number) => {
              !disablePaging && onPageChange && onPageChange(nextPage);
            }}
          />
          <Pagination.PageInfo
            pageSize={pageSize}
            currentPage={page}
            totalItems={totalCount}
            itemLabel="items"
            className="nlss-pagination__pageInfo"
          />
        </>
      )}
    </Container>
  );
}

namespace SearchPagination {
  export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    pageSize: number;
    page: number;
    totalCount?: number;
    onPageChange?: (nextPage: number) => void;
    onPageSizeChange?: (nextPageSize: number) => void;
  }
}

export default SearchPagination;
