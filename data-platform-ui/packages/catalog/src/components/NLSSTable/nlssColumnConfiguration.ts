import { DropdownOption } from '@bbnpm/bb-ui-framework';
import cn from 'classnames';
import escapeRegExp from 'lodash/escapeRegExp';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import { IFormDisplayToggleProps } from '../SharedEditForms';

import { SortDirection } from '../Table';

import createNLSSTableHeaderCell, { NLSSTableHeaderCellComponentType } from './createNLSSTableHeaderCell';
import { BooleanPropertyNames, FilterFieldType, INLSSTableColumnOptions, NLSSTableCellRenderer } from './types';

export default class NLSSColumnConfiguration<T extends Record<string, any>> {
  HeaderCell: NLSSTableHeaderCellComponentType<T>;

  dataKey: keyof T;

  displayDataKey: keyof T;

  isNumberValue: boolean;

  isArrayValue: boolean;

  filterPlaceholder: string = '';

  filterType: FilterFieldType | undefined = undefined;

  cellRenderer: NLSSTableCellRenderer<T>;

  cellClassName: string;

  createFormProps: (rowData: T) => Omit<IFormDisplayToggleProps, 'children'>;

  constructor({
    dataKey,
    gridColumnSpan,
    headerLabel,
    headerCellClassName,
    cellRenderer,
    displayDataKey: _displayKey,
    cellClassName,
    filter,
    isNumberValue,
    editableDeciderKey,
    formRender,
    disableSort,
    isArrayValue
  }: INLSSTableColumnOptions<T>) {
    this.dataKey = dataKey;

    const displayDataKey: keyof T = _displayKey || dataKey;

    this.displayDataKey = displayDataKey;

    const gridColClassName = `nlss-table-grid--${gridColumnSpan}`;

    this.HeaderCell = createNLSSTableHeaderCell({
      dataKey,
      headerLabel,
      disableSort: disableSort === true,
      className: cn(gridColClassName, headerCellClassName)
    });

    this.cellClassName = cn(gridColClassName, cellClassName);
    this.cellRenderer = !isNil(cellRenderer)
      ? cellRenderer
      : (((rowData: T) => rowData[displayDataKey]) as NLSSTableCellRenderer<T>);
    this.isNumberValue = isNumberValue === true;

    this.isArrayValue = isArrayValue === true;

    if (!isNil(filter)) {
      this.filterPlaceholder = !isNil(filter.placeholder) ? filter.placeholder : '';
      this.filterType = filter.type;
    }

    this.createFormProps = NLSSColumnConfiguration.createFormPropsFactory(editableDeciderKey, formRender);

    this.createFilterCallback = this.createFilterCallback.bind(this);
    this.createSortCallback = this.createSortCallback.bind(this);
    this._dataValuePick = this._dataValuePick.bind(this);
    this.createFilterOptionMapper = this.createFilterOptionMapper.bind(this);
  }

  get hasFilter() {
    return this.filterType !== undefined;
  }

  /**
   * Creates array filter for column.
   * @param activeFilterValue - Value from filter input
   * @return {(rowData: T) => boolean}
   */
  public createFilterCallback(activeFilterValue?: any): (rowData: T) => boolean {
    if (!this.hasFilter || isNil(activeFilterValue) || isEmpty(activeFilterValue.toString().trim())) {
      return () => true;
    }

    let valueTest: (value: any | undefined | null) => boolean;

    if (this.isNumberValue) {
      valueTest = (value: number | undefined | null) => !isNil(value) && value === activeFilterValue;
    } else {
      const regEx = new RegExp(escapeRegExp((activeFilterValue as any).toString()), 'gmi');
      valueTest = (value: string | undefined | null) => !isNil(value) && value.search(regEx) >= 0;
    }

    if (!this.isArrayValue) {
      return (rowData: T) => valueTest(this._dataValuePick(rowData));
    }
    return (rowData: T) => {
      const values = this._dataValuePick(rowData);
      if (isNil(values)) {
        return false;
      }

      for (const item of values) {
        if (!valueTest(item)) {
          return false;
        }
      }
      return true;
    };
  }

  private _dataValuePick(rowData: T): any {
    return rowData[this.dataKey];
  }

  public sortValuePicker(rowData: T): any | undefined {
    const rawValue = rowData[this.displayDataKey];

    if (isNil(rawValue)) {
      return undefined;
    }

    const value: any = this.isArrayValue ? rawValue[0] : rawValue;

    return typeof value === 'string' ? value.toUpperCase() : value;
  }

  /**
   * Creates a compare function depending on direction.
   * @example
   * // a < b returns -1
   * // a > b returns 1
   * createSortCallback(SortDirection.DESC)
   * @example
   * // a < b returns -1
   * // a > b returns 1
   * createSortCallback(SortDirection.ASC)
   *
   * @param {SortDirection} sortDirection
   * @return {(a: T, b: T) => number}
   */
  public createSortCallback(sortDirection: SortDirection): (a: T, b: T) => number {
    let lessThan = -1;
    let greatThan = 1;

    if (sortDirection === SortDirection.ASC) {
      lessThan = 1;
      greatThan = -1;
    }

    return (rowA: T, rowB: T) => {
      const valueA: any | undefined = this.sortValuePicker(rowA);
      const valueB: any | undefined = this.sortValuePicker(rowB);

      if (valueA === valueB) {
        return 0;
      }

      if (!isNil(valueA) && !isNil(valueB)) {
        return valueA > valueB ? greatThan : lessThan;
      }

      return isNil(valueA) ? greatThan : lessThan;
    };
  }

  /**
   * Creates drop down options. Label text is the value corresponding to the displayDataKey
   * @param {T[]} items
   * @return {DropdownOption[]}
   */
  public createFilterOptionMapper(items?: T[]): DropdownOption[] {
    if (isNil(items) || items.length <= 0) {
      return [];
    }

    const options: DropdownOption[] = [];
    const prevValues: { [key: string]: boolean } = {};

    for (const item of items) {
      const value = this._dataValuePick(item) as any;
      const label = item[this.displayDataKey] as any;

      if (!isNil(value) && prevValues[value] !== true && !isNil(label)) {
        options.push({ value, label });
        prevValues[value] = true;
      }
    }

    return options;
  }

  static createFormPropsFactory<T extends Record<string, any>>(
    editableDeciderKey?: BooleanPropertyNames<T>,
    cellFormRender?: INLSSTableColumnOptions<T>['formRender']
  ): (rowData: T) => Omit<IFormDisplayToggleProps, 'children'> {
    if (isNil(editableDeciderKey) || isNil(cellFormRender)) {
      return () => ({});
    }
    return (rowData: T) => {
      if ((rowData[editableDeciderKey] as any) === true) {
        return {
          editable: true,
          formRender: cellFormRender.bind(null, rowData)
        };
      }
      return { editable: false };
    };
  }
}
