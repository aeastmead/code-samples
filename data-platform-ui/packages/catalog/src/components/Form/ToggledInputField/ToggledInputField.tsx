import React from 'react';
import ToggledInput, { ToggledInputProps, ToggledInputValue } from './ToggledInput';
import { Field, FieldProps, FieldValidator, getIn } from 'formik';
import FormUtils from '../utils';

export interface ToggledInputFieldProps extends Omit<InnerToggledInputFieldProps, keyof FieldProps<ToggledInputValue>> {
  name: string;
  validate?: FieldValidator;
  value?: ToggledInputValue;
}

interface InnerToggledInputFieldProps
  extends Omit<FieldProps<ToggledInputValue>, 'meta'>,
    Omit<ToggledInputProps, 'name' | 'value' | 'onToggleChange' | 'onFocus' | 'onChange' | 'onBlur'> {
  meta?: FieldProps<ToggledInputValue>['meta'];
}

class InnerToggledInputField extends React.PureComponent<InnerToggledInputFieldProps> {
  render() {
    const { field, meta, form, ...rest } = this.props;

    const touched: boolean = getIn(form.touched, field.name, false);

    const error: string | undefined = getIn(form.errors, field.name);

    return (
      <ToggledInput
        {...rest}
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        errorMessage={FormUtils.parseFieldError({ touched, error })}
        onToggleChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
          field.onChange({
            target: {
              type: 'text',
              name: field.name,
              value: ev.currentTarget.checked ? '' : false
            }
          });
        }}
      />
    );
  }
}

export default function ToggledInputField({
  name: _fieldName,
  validate,
  value,

  ...rest
}: ToggledInputFieldProps): React.ReactElement {
  return (
    <Field
      {...rest}
      validate={validate}
      type="text"
      value={value}
      name={_fieldName}
      component={InnerToggledInputField}
    />
  );
}
