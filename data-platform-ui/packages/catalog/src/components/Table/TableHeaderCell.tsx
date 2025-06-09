import cn from 'classnames';
import React from 'react';
import { VirtualTable } from '@bbnpm/bb-ui-framework';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import { SortDirection, TABLE_DEFAULT_SORT_DIRECTION } from './types';

export default function TableHeaderCell({
  label,
  sortActive: _sortActive,
  sortDirection: _sortDirection,
  className,
  onSort,
  noSort,
  children,
  ...props
}: Props): React.ReactElement {
  const sortEnabled = noSort !== true;
  const sortActive = sortEnabled && _sortActive === true;

  const sortDirection: SortDirection = _sortDirection || TABLE_DEFAULT_SORT_DIRECTION;

  return (
    <Container
      {...props}
      role="cell"
      className={cn(
        'nlss-table-header-cell',
        { 'nlss-table-header-cell--sorting': sortActive, 'nlss-table-header-cell--no-sort': !sortEnabled },
        className
      )}>
      <div onClick={onSort} className="nlss-table-header-cell__top">
        <div className="nlss-table-header-cell__label">{label}</div>
        {sortEnabled && (
          <VirtualTable.SortIndicator
            className="nlss-table-header-cell__sort"
            sortDirection={sortDirection}
            disabled={!sortActive}
          />
        )}
      </div>
      <div className="nlss-table-header-cell__bottom">{children}</div>
    </Container>
  );
}

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .nlss-table-header-cell {
    &__top {
      display: flex;
      align-items: center;
      padding-bottom: 12px;
    }

    &__bottom {
      width: 100%;
    }
  }
`;

type Props = ITableHeadCellProps;

export interface ITableHeadCellProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  sortActive?: boolean;
  sortDirection?: SortDirection;
  onSort?: (event: React.MouseEvent<HTMLDivElement>) => void;
  noSort?: boolean;
  children?: React.ReactNode;
}

export type TableHeaderCellComponentType = React.ComponentType<ITableHeadCellProps>;
