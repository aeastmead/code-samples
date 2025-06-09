import { Field, FieldAttributes } from 'formik';
import React from 'react';
import MultiDropdown, { IMultiDropdownProps } from './MultiDropdown';

export default function MultiDropdownField(props: IMultiDropdownFieldProps): React.ReactElement {
  return <Field {...props} component={MultiDropdown} />;
}

MultiDropdownField.displayName = 'NLSSMultiDropdownField';

export interface IMultiDropdownFieldProps
  extends Omit<FieldAttributes<any>, 'children' | 'render' | 'component' | 'as'>,
    Omit<IMultiDropdownProps, 'meta' | 'form' | 'field' | 'onChange'> {}
