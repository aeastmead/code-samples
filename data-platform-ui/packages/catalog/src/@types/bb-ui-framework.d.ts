import '@bbnpm/bb-ui-framework';
import { AllowCreate, DropdownOption } from '@bbnpm/bb-ui-framework/dist/types/components/BaseDropdown/types';

import { Theme } from '@bbnpm/bb-ui-framework/dist/types/theme/theme-types';
import { TabsProps } from '@bbnpm/bb-ui-framework/dist/types/components/Tabs/Tabs';
import { DropdownProps as BBDropdownProps } from '@bbnpm/bb-ui-framework/dist/types/components/Dropdown/Dropdown';
import { InputProps } from '@bbnpm/bb-ui-framework/dist/types/components/Input/Input';

import { FormFieldProps } from '@bbnpm/bb-ui-framework/dist/types/components/FormField/FormField';

import { ButtonProps } from '@bbnpm/bb-ui-framework/dist/types/components/Button/Button';
import { PaginationProps } from '@bbnpm/bb-ui-framework/dist/types/components/Pagination/Pagination';
import { TextAreaProps } from '@bbnpm/bb-ui-framework/dist/types/components/TextArea/TextArea';
import { IconProps, IconNames } from '@bbnpm/bb-ui-framework/dist/types/components/Icon/Icon';
import { TabsPaneProps } from '@bbnpm/bb-ui-framework/dist/types/components/Tabs/TabsPane/Tabs.Pane';
import { ProgressOverlayProps as BBProgressOverlayProps } from '@bbnpm/bb-ui-framework/dist/types/components/ProgressOverlay/ProgressOverlay';
import { PageInfoProps } from '@bbnpm/bb-ui-framework/dist/types/components/Pagination/PageInfo/Pagination.PageInfo';
import { MultiDropdownProps as BBMultiDropdownProps } from '@bbnpm/bb-ui-framework/dist/types/components/MultiDropdown/MultiDropdown';
import { TitleBarProps } from '@bbnpm/bb-ui-framework/dist/types/components/TitleBar/TitleBar';
import { CollapsibleProps } from '@bbnpm/bb-ui-framework/dist/types/components/Collapsible/Collapsible';
import type { DialogProps } from '@bbnpm/bb-ui-framework/dist/types/components/Dialog/Dialog';
import React from 'react';

declare module '@bbnpm/bb-ui-framework' {
  export interface DropdownProps extends Partial<Omit<BBDropdownProps, 'options' | 'onChange'>> {
    onChange: BBDropdownProps['onChange'];
    options: BBDropdownProps['options'];
  }

  export interface ProgressOverlayProps extends Omit<BBProgressOverlayProps, 'active'> {
    active?: boolean;
  }

  export interface MultiDropdownProps
    extends Omit<
      BBMultiDropdownProps,
      | 'deselectAllNode'
      | 'showTags'
      | 'optionRenderer'
      | 'searchable'
      | 'allowCreate'
      | 'autoFocus'
      | 'className'
      | 'createOptionRenderer'
      | 'name'
      | 'noResultsNode'
      | 'onCreate'
      | 'placeholder'
    > {
    showTags?: boolean;
    allowCreate?: AllowCreate;
    autoFocus?: boolean;
    className?: string;
    createOptionRenderer?: (option: string) => React.ReactNode;
    disabled?: boolean;
    name?: string;
    noResultsNode?: React.ReactNode;
    onCreate?: (option: DropdownOption) => void;
    placeholder?: string;
    searchable?: boolean;
  }

  export type { CheckBoxProps } from '@bbnpm/bb-ui-framework/dist/types/components/Checkbox/Checkbox';

  export declare interface AccordionPanelProps extends Partial<CollapsibleProps> {
    header: React.ReactNode;
  }

  export type {
    Theme,
    TabsProps,
    TitleBarProps,
    InputProps,
    FormFieldProps,
    ButtonProps,
    PaginationProps,
    TextAreaProps,
    IconProps,
    IconNames,
    TabsPaneProps,
    PageInfoProps,
    CollapsibleProps,
    DialogProps
  };
}
