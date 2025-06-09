import cn from 'classnames';
import React from 'react';
import styled, { DefaultTheme, StyledComponentBase } from 'styled-components';
import TableCell, { TableCellComponentType } from './TableCell';
import TableHeaderCell, { TableHeaderCellComponentType } from './TableHeaderCell';
import TableRow, { TableRowComponentType } from './TableRow';

const Table: ITableComponentType = styled.div.attrs(({ className }) => ({
  className: cn('nlss-table', className),
  role: 'table'
}))`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;

  [role='row'] {
    border-bottom: 1px solid ${({ theme }) => theme.tables.colors.border};

    & > :first-child {
      padding-left: 10px;
    }

    & > :last-child {
      padding-right: 10px;
    }
  }

  [role='cell'] {
    min-height: 40px;
    padding: 12px 0;
  }

  .tableRow {
    &__header {
      color: ${({ theme }) => theme.colors.text};
      font-size: ${({ theme }) => theme.font.size.base};
      font-weight: ${({ theme }) => theme.font.weight.medium};
    }

    &:hover {
      background: ${({ theme }) => theme.tables.colors.highlight};
    }
  }

  .bbui-sort_indicator {
    height: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .nlss-table-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-column-gap: 15px;
    &--1 {
      grid-column: span 1;
    }

    &--2 {
      grid-column: span 2;
    }

    &--3 {
      grid-column: span 3;
    }

    &--4 {
      grid-column: span 4;
    }

    &--5 {
      grid-column: span 5;
    }

    &--6 {
      grid-column: span 6;
    }

    &--7 {
      grid-column: span 7;
    }

    &--8 {
      grid-column: span 8;
    }

    &--9 {
      grid-column: span 9;
    }

    &--10 {
      grid-column: span 10;
    }

    &--11 {
      grid-column: span 11;
    }

    &--12 {
      grid-column: span 12;
    }
  }
` as any;

Table.HeaderCell = TableHeaderCell;

Table.HeaderRow = styled.div.attrs(({ className }) => ({
  className: cn('nlss-table__header-row', 'nlss-table-grid', className),
  role: 'row'
}))`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

Table.Cell = TableCell;

Table.Row = TableRow;

export default Table;

export interface ITableComponentType extends StyledComponentBase<'div', DefaultTheme> {
  HeaderRow: StyledComponentBase<'div', DefaultTheme, Record<string, any>, any>;
  HeaderCell: TableHeaderCellComponentType;
  Row: TableRowComponentType;
  Cell: TableCellComponentType;
}

export interface ITableProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  theme?: DefaultTheme;
}

export interface ITableHeaderRowProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  theme?: DefaultTheme;
}

export interface ITableCellProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  theme?: DefaultTheme;
}
