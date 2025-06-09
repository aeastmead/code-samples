import cn from 'classnames';
import { FieldProps, getIn } from 'formik';
import eq from 'lodash/eq';
import React from 'react';
import {
  Dropdown as BBDropdown,
  DropdownOption,
  DropdownProps as BBDropdownProps,
  FormField
} from '@bbnpm/bb-ui-framework';

export default class Dropdown extends React.PureComponent<Props> {
  static displayName = 'NLSSDropdown';

  constructor(props: Props) {
    super(props);

    this._handleBlur = this._handleBlur.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }

  public render(): React.ReactNode | null {
    const { field, form, label, labelPosition, dropdownClassName, className, ...props } = this.props;
    let validationContent: React.ReactNode;
    let validationType: 'error' | undefined;

    const error: string | undefined = getIn(form.errors, field.name);
    const touched: boolean = getIn(form.touched, field.name, false);

    if (error !== undefined && touched) {
      validationType = 'error';
      validationContent = <>{error}</>;
    }
    return (
      <FormField
        validationType={validationType}
        validationContent={validationContent}
        label={label}
        labelPosition={labelPosition}
        htmlFor={field.name}
        className={cn('nlss-dropdown-field', className)}>
        <BBDropdown
          {...props}
          name={field.name}
          id={field.name}
          value={field.value || ''}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          className={cn('nlss-dropdown-field__field', dropdownClassName)}
        />
      </FormField>
    );
  }

  private _handleChange(option?: DropdownOption): void {
    const { field, onChange, form } = this.props;
    const prevValue = field.value?.toString() ?? '';
    const value = option?.value ?? '';

    if (!eq(prevValue, value)) {
      form.setFieldValue(field.name, value);
      onChange && onChange(value);
    }
  }

  private _handleBlur(): void {
    const {
      form,
      field: { name }
    } = this.props;
    form.setFieldTouched(name);
  }
}

type Props = IDropdownProps;

export interface IDropdownProps
  extends Omit<FieldProps, 'validation' | 'meta' | 'onChange'>,
    Omit<
      BBDropdownProps,
      'children' | 'validation' | 'form' | 'validationType' | 'validationContent' | 'onChange' | 'onBlur' | 'value'
    > {
  dropdownClassName?: string;

  label?: string;

  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  onChange?: (value: any) => void;
}
