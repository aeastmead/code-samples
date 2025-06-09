import { Checkbox, CheckBoxProps } from '@bbnpm/bb-ui-framework';
import { Field, FieldProps } from 'formik';
import React from 'react';
import cn from 'classnames';

import FormUtils from './utils';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

export interface CheckboxProps<TValue extends string | number = any>
  extends Omit<CheckBoxProps, 'name' | 'checked' | 'value' | 'onBlur' | 'onChange'> {
  value: TValue;
  checked?: boolean;
  name: string;
  checkboxClassName?: string;
  label?: string;
  showError?: boolean;
  multiple?: boolean;
}

const Wrapper: StyledComponent<'div', DefaultTheme> = styled.div`
  padding: 8px 0;
  width: 100%;

  label {
    display: flex;

    &:focus-visible,
    &:focus-within {
      outline: none;
    }
  }

  &:focus,
  &:visited {
    outline: none;
  }
`;

export default class CheckboxField<TValue extends string | number> extends React.PureComponent<CheckboxProps<TValue>> {
  render() {
    const {
      name: _fieldName,
      checked: _defaultChecked,
      value: _checkboxValue,
      className,
      checkboxClassName,
      showError,
      validate,
      ...rest
    } = this.props;

    return (
      <Field name={_fieldName} value={_checkboxValue} checked={_defaultChecked} validate={validate} type="checkbox">
        {({ field, meta, form }: FieldProps<TValue[]>) => {
          const error: string | undefined = showError !== false ? FormUtils.parseFieldError(meta) : undefined;
          return (
            <Wrapper className={cn('nlss-checkbox-field', className)}>
              <Checkbox
                {...rest}
                className={cn('nlss-checkbox-field__checkbox', checkboxClassName)}
                value={_checkboxValue}
                name={field.name}
                checked={field.checked}
                onBlur={field.onBlur}
                onChange={(ev: React.ChangeEvent<any>) => {
                  const target = this.createTarget(ev);
                  field.onChange({ target });
                  form.setFieldTouched(field.name, true, false);
                }}
              />
              {error && <div className="nlss-checkbox-field__error">{error}</div>}
            </Wrapper>
          );
        }}
      </Field>
    );
  }

  /**
   * Creates a replica event target for Formik, to ensure number values are not converted to strings.
   * @param event
   */
  createTarget(event: React.ChangeEvent<any>): React.ChangeEvent<any>['target'] {
    const checked: boolean = event.currentTarget.checked;

    const { name, value } = this.props;
    return {
      type: 'checkbox',
      checked,
      value,
      name
    };
  }
}
