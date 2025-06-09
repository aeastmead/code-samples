/* eslint-disable @typescript-eslint/no-namespace */
import React from 'react';
import { FormDisplayToggleRenderProps } from '../SharedEditForms';

/**
 * Column components configurations
 */
export interface INLSSTableColumnOptions<T extends Record<string, any>> {
  /**
   * Column header text
   */
  headerLabel: string;

  /**
   * Default class name for header cell
   */
  headerCellClassName?: string;

  dataKey: keyof T;

  /**
   * Property name for display in row cell. If column filter is a dropdown this will also be used as the label. Defaults to dataKey
   */
  displayDataKey?: keyof T;

  isNumberValue?: boolean;
  isArrayValue?: boolean;

  /**
   * Customize cell content for row
   */
  cellRenderer?: NLSSTableCellRenderer<T>;
  cellClassName?: string;

  /**
   * Number of columns out of 12
   */
  gridColumnSpan: number;

  filter?: NLSSTableColumnFilterOptions;

  editableDeciderKey?: BooleanPropertyNames<T>;

  formRender?: (rowData: T, props: FormDisplayToggleRenderProps) => React.ReactNode;

  disableSort?: boolean;
}

export type BooleanPropertyNames<T> = KeysMatching<T, boolean>;

type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

/**
 * Custom render of Cell content
 */
export type NLSSTableCellRenderer<T extends Record<string, any>> = (
  rowData: T,
  rowIndex: number
) => React.ReactNode | React.ReactText;

export namespace NLSSTableColumnFilterOptions {
  export interface ISearchFilter {
    type: FilterFieldType.SEARCH;
    placeholder?: string;
  }

  export interface IDropdownFilter {
    type: FilterFieldType.DROPDOWN;
    placeholder: string;
  }
}

export type NLSSTableColumnFilterOptions =
  | NLSSTableColumnFilterOptions.ISearchFilter
  | NLSSTableColumnFilterOptions.IDropdownFilter;

export enum FilterFieldType {
  /**
   * Text field
   * @type {FilterFieldType.SEARCH}
   */
  SEARCH = 'search',
  DROPDOWN = 'dropdown'
}
