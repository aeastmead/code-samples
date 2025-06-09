import { FieldAttributes, FieldValidator, Field } from 'formik';
import React from 'react';
import TextArea, { ITextAreaProps } from './TextArea';

export default function TextAreaField(props: Props): React.ReactElement {
  return <Field {...props} component={TextArea} />;
}

TextAreaField.displayName = 'NLSSTextAreaField';

type Props = ITextAreaFieldProps;
export interface ITextAreaFieldProps
  extends Omit<FieldAttributes<any>, 'children' | 'render' | 'component' | 'as'>,
    Omit<ITextAreaProps, 'form' | 'field'> {
  validate?: FieldValidator;
  name: string;
  value?: any;
  inputClassName?: string;
}
