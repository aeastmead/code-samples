import React from 'react';
import cn from 'classnames';
import { FieldConfig, FieldValidator, useField } from 'formik';
import ButtonBar from '../ButtonBar';

function ButtonBarField<TValue>({
  name,
  validate,
  className,
  value: _initialValue,
  type,
  ...rest
}: ButtonBarField.Props<TValue>) {
  const _formikConfig: FieldConfig<TValue> = React.useMemo(
    () => ({ name, validate, value: _initialValue, type }),
    [name, validate, _initialValue]
  );

  const [fieldProps] = useField<TValue>(_formikConfig);

  function handleChange(value: TValue): void {
    if (value !== fieldProps.value) {
      const fakeTarget: React.ChangeEvent<any>['target'] = { name, value, type };
      fieldProps.onChange({ target: fakeTarget });
      fieldProps.onBlur({ target: fakeTarget });
    }
  }

  return (
    <ButtonBar
      {...rest}
      value={fieldProps.value}
      onChange={handleChange}
      className={cn('nlss-btnBarField', className)}
    />
  );
}

namespace ButtonBarField {
  export interface Props<TValue> extends Omit<ButtonBar.Props<TValue>, 'onChange'> {
    name: string;
    validate?: FieldValidator;
    type?: string;
  }
}

export default ButtonBarField;
