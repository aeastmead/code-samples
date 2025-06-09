import { DropdownOption } from '@bbnpm/bb-ui-framework';
import React from 'react';
import cn from 'classnames';
import isNil from 'lodash/isNil';
import { DropdownField } from '../Form';
import InlineEditForm, { IInlineEditFormProps } from './InlineEditForm';

export interface DropdownEditFormProps<Value extends React.ReactText> extends IInlineEditFormProps<Value> {
  options?: DropdownOption[];
}

export default function DropdownEditForm<Value extends React.ReactText>({
  options,
  fieldClassName,
  label,
  labelPosition,
  className,
  validate,
  loading,
  ...props
}: DropdownEditFormProps<Value>): React.ReactElement | null {
  return (
    <InlineEditForm
      {...props}
      loading={loading === true || isNil(options) || options.length <= 0}
      className={cn('nlss-dropdown-edit-form', className)}>
      <DropdownField
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

DropdownEditForm.displayName = 'NLSSDropdownField';
