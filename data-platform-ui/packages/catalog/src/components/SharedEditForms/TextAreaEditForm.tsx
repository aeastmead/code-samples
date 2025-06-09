import cn from 'classnames';
import React from 'react';

import { TextAreaField } from '../Form';
import InlineEditForm, { IInlineEditFormProps } from './InlineEditForm';

export interface ITextAreaEditFormProps extends IInlineEditFormProps<string> {}

export default function TextAreaEditForm({
  fieldClassName,
  label,
  labelPosition,
  className,
  validate,
  ...props
}: ITextAreaEditFormProps): React.ReactElement | null {
  return (
    <InlineEditForm {...props} className={cn('nlss-text-area-edit-form', className)}>
      <TextAreaField
        name="value"
        label={label}
        labelPosition={labelPosition}
        validate={validate}
        className={cn('nlss-text-area-edit-form__field', fieldClassName)}
      />
    </InlineEditForm>
  );
}

TextAreaEditForm.displayName = 'NLSSTextAreaEditForm';
