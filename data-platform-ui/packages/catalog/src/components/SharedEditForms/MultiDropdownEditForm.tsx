import { DropdownOption } from '@bbnpm/bb-ui-framework';
import React from 'react';
import cn from 'classnames';
import isNil from 'lodash/isNil';
import { MultiDropdownField } from '../Form';
import InlineEditForm, { IInlineEditFormProps } from './InlineEditForm';

export interface IMultiDropdownEditFormProps<Value extends React.ReactText> extends IInlineEditFormProps<Value[]> {
  options?: DropdownOption[];
}

export default function MultiDropdownEditForm<Value extends React.ReactText>({
  loading,
  options,
  fieldClassName,
  label,
  labelPosition,
  className,
  validate,
  ...props
}: IMultiDropdownEditFormProps<Value>): React.ReactElement | null {
  return (
    <InlineEditForm
      {...props}
      loading={loading === true || isNil(options) || options.length <= 0}
      className={cn('nlss-dropdown-edit-form', className)}>
      <MultiDropdownField
        options={options ?? []}
        name="value"
        label={label}
        labelPosition={labelPosition}
        validate={validate}
        className={cn('nlss-dropdown-edit-form__field', fieldClassName)}
      />
    </InlineEditForm>
  );
}

MultiDropdownEditForm.displayName = 'NLSSMultiDropdownField';
