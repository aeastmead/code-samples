/* eslint-disable @typescript-eslint/no-unused-vars,no-inner-declarations */
import cn from 'classnames';
import React from 'react';
import Table, { ITableHeadCellProps, SortDirection } from '../Table';

export default function createNLSSTableHeaderCell<T extends Record<string, any>>({
  dataKey,
  headerLabel,
  disableSort,
  ..._options
}: Options<T>): NLSSTableHeaderCellComponentType<T> {
  if (disableSort) {
    function NLSSTableSimpleHeaderCell({
      activeSortDataKey,
      onSort,
      className,
      ...props
    }: Props<T>): React.ReactElement {
      return (
        <Table.HeaderCell
          {...props}
          {..._options}
          className={cn('nlss-tablex-header-cell', _options.className, className)}
          label={headerLabel}
          noSort={true}
        />
      );
    }

    (NLSSTableSimpleHeaderCell as any).displayName = `NLSSTableSimpleHeader(${dataKey})`;
    return NLSSTableSimpleHeaderCell;
  }

  class NLSSTableHeaderCell extends React.PureComponent<Props<T>> {
    static displayName = `NLSSTableHeader(${dataKey})`;

    constructor(props: Props<T>) {
      super(props);
      this._handleSortToggle = this._handleSortToggle.bind(this);
      this._isSortActive = this._isSortActive.bind(this);
    }

    public render() {
      const { activeSortDataKey, onSort, className, ...props } = this.props;

      const sortActive: boolean = this._isSortActive();

      return (
        <Table.HeaderCell
          {...props}
          {..._options}
          className={cn('nlss-tablex-header-cell', _options.className, className)}
          label={headerLabel}
          onSort={this._handleSortToggle}
          sortActive={sortActive}
        />
      );
    }

    private _handleSortToggle(event: React.MouseEvent): void {
      const isSortActive = this._isSortActive();
      const sorting: HeaderCellSortEvent<T> = {
        dataKey,
        sortDirection:
          isSortActive && this.props.sortDirection === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC
      };

      this.props.onSort(sorting);
    }

    private _isSortActive(): boolean {
      return this.props.activeSortDataKey === dataKey;
    }
  }

  return NLSSTableHeaderCell;
}

type Options<T extends Record<string, any>> = ICreateNLSSTableHeaderCellOptions<T>;

type Props<T extends Record<string, any>> = INLSSTableHeaderCellProps<T>;

export interface ICreateNLSSTableHeaderCellOptions<T extends Record<string, any>>
  extends Omit<ITableHeadCellProps, 'onSort' | 'label' | 'children'> {
  dataKey: keyof T;
  headerLabel: string;
  disableSort: boolean;
}

export interface INLSSTableHeaderCellProps<T extends Record<string, any>>
  extends Omit<ITableHeadCellProps, 'onSort' | 'label' | 'children'> {
  onSort: (event: HeaderCellSortEvent<T>) => void;
  activeSortDataKey: keyof T;
}

/**
 * Event emit for sort click
 */
export type HeaderCellSortEvent<T extends Record<string, any>> = {
  /**
   * Data key
   */
  dataKey: keyof T;

  /**
   * New opposite sortDirection. Defaults to DESC
   */
  sortDirection: SortDirection;
};

export type NLSSTableHeaderCellComponentType<T extends Record<string, any>> = React.ComponentType<
  INLSSTableHeaderCellProps<T>
>;
