import { FormField, TextAreaProps, TextArea as BBTextArea, FormFieldProps } from '@bbnpm/bb-ui-framework';
import { FieldProps, getIn } from 'formik';
import eq from 'lodash/eq';
import React from 'react';
import cn from 'classnames';

export default class TextArea extends React.PureComponent<Props> {
  static displayName = 'NLSSTextArea';

  constructor(props: Props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);
  }

  public render() {
    const { field, form, label, labelPosition, textAreaClassName, className, ...props } = this.props;
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
        className={cn('nlss-input-field', className)}>
        <BBTextArea
          {...props}
          name={field.name}
          value={field.value ?? ''}
          onBlur={field.onBlur}
          onChange={this._handleChange as any}
          className={cn('', textAreaClassName)}
        />
      </FormField>
    );
  }

  /**
   * Helps limit the amount of updates
   * @param {React.ChangeEvent<HTMLInputElement>} event
   * @private
   */
  private _handleChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    const { field, onChange } = this.props;
    const prevValue = field.value ?? '';
    const value = event.target.value;

    if (!eq(prevValue, value)) {
      field.onChange(event);
      onChange && onChange(event);
    }
  }
}

type Props = ITextAreaProps;
export interface ITextAreaProps
  extends Omit<TextAreaProps, 'validation' | 'form' | 'children' | 'validationType' | 'validationContent'>,
    Omit<FieldProps, 'validation' | 'meta'> {
  textAreaClassName?: string;

  label?: string;

  labelPosition?: FormFieldProps['labelPosition'];
}
