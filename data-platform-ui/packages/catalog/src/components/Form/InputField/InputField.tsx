import React from 'react';
import { Field, FieldAttributes, FieldValidator } from 'formik';
import Input, { IInputProps } from './Input';

export default function InputField(props: Props): React.ReactElement {
  return <Field {...props} component={Input} />;
}

InputField.displayName = 'NLSSInputField';

export interface IInputFieldProps
  extends Omit<FieldAttributes<any>, 'children' | 'render' | 'component' | 'as'>,
    Omit<IInputProps, 'meta' | 'form' | 'field'> {
  validate?: FieldValidator;
  name: string;
  value?: any;
  type?: 'text' | 'number' | 'email';
  inputClassName?: string;
}

type Props = IInputFieldProps;
