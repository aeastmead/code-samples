/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dropdown, DropdownOption, Input } from '@bbnpm/bb-ui-framework';
import cn from 'classnames';
import isNil from 'lodash/isNil';
import React from 'react';
import { LinkProps } from 'react-router-dom';
import Table, { ITableProps, SortDirection } from '../Table';
import { HeaderCellSortEvent } from './createNLSSTableHeaderCell';
import NLSSColumnConfiguration from './nlssColumnConfiguration';
import NLSSTableManager from './nlssTableManager';
import { FilterFieldType, INLSSTableColumnOptions } from './types';

export default function createNLSSTable<T extends Record<string, any>>(
  columnOptions: INLSSTableColumnOptions<T>[],
  { initialSortDataKey, mapRowLinkTo, className: defaultClassName, ...defaultTableProps }: INLSSTableOptions<T>
): NLSSTableComponentType<T> {
  const tableManager: NLSSTableManager<T> = new NLSSTableManager<T>(columnOptions);

  class NLSSTable extends React.PureComponent<Props<T>, State<T>> {
    static displayName = 'NLSSTable';

    state: State<T> = {
      sortDirection: SortDirection.DESC,
      sortDataKey: initialSortDataKey,
      activeFilters: {}
    };

    constructor(props: Props<T>) {
      super(props);
      this._handleSort = this._handleSort.bind(this);
      this._processItems = this._processItems.bind(this);
      this._handleDropdownChange = this._handleDropdownChange.bind(this);
      this._handleInputChange = this._handleInputChange.bind(this);
    }

    public componentDidMount() {
      this.props.onLoad && this.props.onLoad();
    }

    public componentWillUnmount() {
      this.props.onUnload && this.props.onUnload();
    }

    public render() {
      const { items, loading, className, ...props } = this.props;
      if (loading === true) {
        return null;
      }

      const { sortDataKey, sortDirection } = this.state;

      const rows: T[] = this._processItems();
      return (
        <Table {...props} {...defaultTableProps} className={cn('nlss-tablex', defaultClassName, className)}>
          <Table.HeaderRow className={cn('nlss-tablex__header-row')}>
            {tableManager.map(
              (
                {
                  HeaderCell,
                  filterType,
                  hasFilter,
                  createFilterOptionMapper,
                  dataKey,
                  filterPlaceholder
                }: NLSSColumnConfiguration<T>,
                index: number
              ) => {
                const filterValue = this.state.activeFilters[dataKey] || '';
                return (
                  <HeaderCell
                    key={index.toString()}
                    activeSortDataKey={sortDataKey}
                    sortDirection={sortDirection}
                    onSort={this._handleSort}
                    className="nlss-tablex__header-cell">
                    {hasFilter &&
                      (filterType === FilterFieldType.SEARCH ? (
                        <Input
                          type="text"
                          name={dataKey}
                          placeholder={filterPlaceholder}
                          value={filterValue}
                          onChange={this._handleInputChange}
                        />
                      ) : (
                        <Dropdown
                          clearable={true}
                          placeholder={filterPlaceholder}
                          options={createFilterOptionMapper(rows) || []}
                          onChange={this._handleDropdownChange.bind(this, dataKey)}
                        />
                      ))}
                  </HeaderCell>
                );
              }
            )}
          </Table.HeaderRow>
          {rows.length > 0 ? (
            rows.map((rowData: T, rowIndex: number) => (
              <Table.Row
                className="nlss-tablex__row"
                key={rowIndex.toString()}
                to={mapRowLinkTo && mapRowLinkTo(rowData)}>
                {tableManager.map(
                  ({ cellRenderer, cellClassName, createFormProps }: NLSSColumnConfiguration<T>, index) => (
                    <Table.Cell
                      key={index.toString()}
                      {...createFormProps(rowData)}
                      className={cn('nlss-tablex__cell', cellClassName)}>
                      {cellRenderer(rowData, rowIndex)}
                    </Table.Cell>
                  )
                )}
              </Table.Row>
            ))
          ) : (
            <div>none</div>
          )}
        </Table>
      );
    }

    private _processItems(): T[] {
      const { items } = this.props;

      if (isNil(items) || items.length <= 0) {
        return [];
      }

      const { activeFilters, sortDataKey, sortDirection } = this.state;

      return items
        .filter(tableManager.createFilterCallback(activeFilters))
        .sort(tableManager.createSortCallback(sortDataKey, sortDirection));
    }

    private _handleSort(event: HeaderCellSortEvent<T>): void {
      this.setState({ sortDataKey: event.dataKey, sortDirection: event.sortDirection });
    }

    private _handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
      const { name, value } = event.target;
      this.setState(({ activeFilters }: State<T>) => {
        return {
          activeFilters: {
            ...activeFilters,
            [name]: value
          }
        };
      });
    }

    private _handleDropdownChange(dataKey: keyof T, option?: DropdownOption): void {
      this.setState(({ activeFilters }: State<T>) => {
        return {
          activeFilters: {
            ...activeFilters,
            [dataKey]: option?.value
          }
        };
      });
    }
  }

  return NLSSTable;
}

type Props<T extends Record<string, any>> = INLSSTableProps<T>;

type State<T extends Record<string, any>> = {
  /**
   * Data key of the active sort
   */
  sortDataKey: keyof T;
  sortDirection: SortDirection;

  /**
   * Values of filter fields
   */
  activeFilters: { [key: string]: any };
};

/**
 * Table configuration and default props for component.
 */
export interface INLSSTableOptions<T extends Record<string, any>>
  extends Omit<INLSSTableProps<T>, 'items' | 'loading'> {
  /**
   * Data key for initial sort
   */
  initialSortDataKey: keyof T;

  /**
   * Map row data to a Link. If not set row is wrapped with a div
   */
  mapRowLinkTo?: (rowData: T) => LinkProps['to'];
}

/**
 * Props of created component
 */
export interface INLSSTableProps<T extends Record<string, any>>
  extends Omit<ITableProps, 'children' | 'ref' | 'onLoad' | 'onUnload'> {
  items?: T[] | undefined;

  loading?: boolean;
  onLoad?: () => void;
  onUnload?: () => void;
}

export type NLSSTableComponentType<T extends Record<string, any>> = React.ComponentClass<INLSSTableProps<T>, State<T>>;
