import cn from 'classnames';
import { FieldProps, getIn } from 'formik';
import React from 'react';
import isNil from 'lodash/isNil';
import {
  MultiDropdown as BBMultiDropdown,
  DropdownOption,
  MultiDropdownProps as BBMultiDropdownProps,
  FormField
} from '@bbnpm/bb-ui-framework';

export default class MultiDropdown extends React.PureComponent<Props> {
  static displayName = 'NLSSMultiDropdown';

  constructor(props: Props) {
    super(props);

    this._handleBlur = this._handleBlur.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._getSelectedOptions = this._getSelectedOptions.bind(this);
  }

  public render(): React.ReactNode | null {
    const { field, form, label, labelPosition, multiDropdownClassName, className, ...props } = this.props;
    let validationContent: React.ReactNode;
    let validationType: 'error' | undefined;

    const error: string | undefined = getIn(form.errors, field.name);
    const touched: boolean = getIn(form.touched, field.name, false);

    if (error !== undefined && touched) {
      validationType = 'error';
      validationContent = <>{error}</>;
    }
    const selectedOptions: DropdownOption[] = this._getSelectedOptions();
    return (
      <FormField
        validationType={validationType}
        validationContent={validationContent}
        label={label}
        labelPosition={labelPosition}
        htmlFor={field.name}
        className={cn('nlss-multiDropdown-field', className)}>
        <BBMultiDropdown
          {...props}
          name={field.name}
          selectedOptions={selectedOptions}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          className={cn('nlss-multiDropdown-field__field', multiDropdownClassName)}
        />
      </FormField>
    );
  }

  private _getSelectedOptions(): DropdownOption[] {
    const { field, options } = this.props;

    if (isNil(options) || options.length <= 0 || isNil(field.value) || field.value.length <= 0) {
      return [];
    }

    const selectedOptions: DropdownOption[] = [];

    for (const option of options) {
      if (field.value.includes(option.value)) {
        selectedOptions.push(option);
      }
    }

    return selectedOptions;
  }

  private _handleChange(selectionOptions: DropdownOption[], _: DropdownOption | null): void {
    const { field, onChange, form } = this.props;

    let values: React.ReactText[] | undefined;
    if (!isNil(selectionOptions) && selectionOptions.length > 0) {
      values = selectionOptions.map(({ value }: DropdownOption) => value);
    }

    form.setFieldValue(field.name, values);
    onChange && onChange(values);
  }

  private _handleBlur(): void {
    const {
      form,
      field: { name }
    } = this.props;
    form.setFieldTouched(name);
  }
}

type Props = IMultiDropdownProps;

export interface IMultiDropdownProps
  extends Omit<FieldProps, 'validation' | 'meta' | 'onChange'>,
    Omit<
      BBMultiDropdownProps,
      | 'children'
      | 'validation'
      | 'form'
      | 'validationType'
      | 'validationContent'
      | 'onChange'
      | 'onBlur'
      | 'value'
      | 'selectedOptions'
    > {
  multiDropdownClassName?: string;

  label?: string;

  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  onChange?: (value: any[] | undefined) => void;
}
