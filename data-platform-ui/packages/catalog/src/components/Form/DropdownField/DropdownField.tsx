import { Field, FieldAttributes } from 'formik';
import React from 'react';
import Dropdown, { IDropdownProps } from './Dropdown';

export default function DropdownField(props: IDropdownFieldProps): React.ReactElement {
  return <Field {...props} component={Dropdown} />;
}

DropdownField.displayName = 'NLSSDropdownField';

export interface IDropdownFieldProps
  extends Omit<FieldAttributes<any>, 'children' | 'render' | 'component' | 'as'>,
    Omit<IDropdownProps, 'meta' | 'form' | 'field' | 'onChange'> {}
