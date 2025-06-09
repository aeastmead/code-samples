import isNil from 'lodash/isNil';
import { SortDirection } from '../Table';
import NLSSColumnConfiguration from './nlssColumnConfiguration';
import { INLSSTableColumnOptions } from './types';

/**
 * Stores column configurations in order. Builds filter and sort callbacks.
 */
export default class NLSSTableManager<T extends Record<string, any>> {
  columns: { [key: string]: NLSSColumnConfiguration<T> } = {};
  columnDataKeys: string[] = [];

  constructor(columnOptions: INLSSTableColumnOptions<T>[]) {
    for (const _columnOption of columnOptions) {
      this.columns[_columnOption.dataKey] = new NLSSColumnConfiguration<T>(_columnOption);
      this.columnDataKeys.push(_columnOption.dataKey);
    }

    this.map = this.map.bind(this);
    this.createFilterCallback = this.createFilterCallback.bind(this);
    this.createSortCallback = this.createSortCallback.bind(this);
  }

  public map<R>(callback: (value: NLSSColumnConfiguration<T>, index: number) => R): R[] {
    const result: R[] = [];
    for (const dataKey of this.columnDataKeys) {
      const column: NLSSColumnConfiguration<T> | undefined = this.columns[dataKey];
      if (!isNil(column)) {
        result.push(callback(column, result.length));
      }
    }
    return result;
  }

  /**
   * Combines filter callbacks from columns
   * @param {{[p: string]: any}} activeFilters
   * @return {(rowData: T) => boolean}
   */
  public createFilterCallback(activeFilters: { [key: string]: any }): (rowData: T) => boolean {
    const filterCallbacks: ((rowData: T) => boolean)[] = [];

    for (const dataKey of Object.keys(activeFilters)) {
      const columnConfig: NLSSColumnConfiguration<T> | undefined = this.columns[dataKey];
      if (isNil(columnConfig)) {
        continue;
      }
      filterCallbacks.push(columnConfig.createFilterCallback(activeFilters[dataKey]));
    }

    if (filterCallbacks.length <= 0) {
      return () => true;
    }

    return (rowData: T) => {
      for (const filterCallback of filterCallbacks) {
        if (!filterCallback(rowData)) {
          return false;
        }
      }
      return true;
    };
  }

  /**
   * Gets sort callback from column matching dataKey.
   * @param {keyof T} dataKey
   * @param {SortDirection} sortDirection
   * @return {(a: T, b: T) => number}
   */
  public createSortCallback(dataKey: keyof T, sortDirection: SortDirection): (a: T, b: T) => number {
    const columnConfig: NLSSColumnConfiguration<T> | undefined = this.columns[dataKey];
    if (isNil(columnConfig)) {
      return () => 0;
    }

    return columnConfig.createSortCallback(sortDirection);
  }
}
