import React from 'react';
import cn from 'classnames';
import { InputField } from '../Form';
import InlineEditForm, { IInlineEditFormProps } from './InlineEditForm';

export interface ISingleInputEditFormProps<Value extends string | number> extends IInlineEditFormProps<Value> {
  type?: 'text' | 'number' | 'email';
}

export default function SingleInputEditForm<Value extends string | number>({
  type,
  fieldClassName,
  label,
  labelPosition,
  className,
  validate,
  ...props
}: ISingleInputEditFormProps<Value>): React.ReactElement | null {
  return (
    <InlineEditForm {...props} className={cn('nlss-single-input-edit-form', className)}>
      <InputField
        name="value"
        type={type ?? 'text'}
        label={label}
        labelPosition={labelPosition}
        validate={validate}
        className={cn('nlss-single-input-edit-form__field', fieldClassName)}
      />
    </InlineEditForm>
  );
}

SingleInputEditForm.displayName = 'NLSSSingleInputEditForm';
