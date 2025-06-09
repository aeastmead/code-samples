import { FormField, Input as BBInput, InputProps } from '@bbnpm/bb-ui-framework';
import { FieldProps, getIn } from 'formik';
import React from 'react';
import cn from 'classnames';
import eq from 'lodash/eq';
import { nlssUtils } from '@nlss/brain-trust';

/**
 * Wrapping BB UI's FormikField and Input to be used as a Formik field
 */

const labelIdGen: nlssUtils.SimpleUniqueGenerator = nlssUtils.createSimpleUniqGen('nlss-input');
export default class Input extends React.PureComponent<Props> {
  static displayName = 'NLSSInput';

  static defaultProps: Partial<Props> = {
    labelPosition: 'top',
    type: 'text'
  };

  private labelId: string = labelIdGen();

  constructor(props: Props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);
  }

  public render() {
    const { field, form, label, labelPosition, type, inputClassName, className, ...props } = this.props;
    let validationContent: React.ReactNode;
    let validationType: 'error' | undefined;
    let hasError = false;

    const error: string | undefined = getIn(form.errors, field.name);
    const touched: boolean = getIn(form.touched, field.name, false);

    if (error !== undefined && touched) {
      validationType = 'error';
      validationContent = <>{error}</>;
      hasError = true;
    }

    return (
      <FormField
        validationType={validationType}
        validationContent={validationContent}
        label={label}
        labelPosition={labelPosition}
        htmlFor={this.labelId}
        className={cn('nlss-input-field', className)}>
        <BBInput
          {...props}
          type={type}
          name={field.name}
          id={this.labelId}
          value={field.value || ''}
          onBlur={field.onBlur}
          className={cn('nlss-input-field__input', inputClassName)}
          onChange={this._handleChange}
          validation={validationType}
          aria-invalid={hasError}
        />
      </FormField>
    );
  }

  /**
   * Helps limit the amount of updates
   * @param {React.ChangeEvent<HTMLInputElement>} event
   * @private
   */
  private _handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { field, onChange } = this.props;
    const prevValue = field.value?.toString() ?? '';
    const value = event.target.value;

    if (!eq(prevValue, value)) {
      field.onChange(event);
      onChange && onChange(event);
    }
  }
}

type Props = IInputProps;
export interface IInputProps
  extends Omit<FieldProps, 'validation' | 'meta'>,
    Omit<InputProps, 'children' | 'validation' | 'form' | 'validationType' | 'validationContent'> {
  inputClassName?: string;

  label?: string;

  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
}
