import { FormField } from '@bbnpm/bb-ui-framework';
import { Field, FieldProps, FieldValidator } from 'formik';
import React from 'react';
import cn from 'classnames';
import UUIDAutoComplete, { IUUIDAutoCompleteProps } from './UUIDAutoComplete';

export default class UUIDAutoCompleteField extends React.PureComponent<Props> {
  static displayName = 'NLSSUUIDAutoCompleteField';

  constructor(props: Props) {
    super(props);
  }

  public render(): React.ReactNode | null {
    const { label, labelPosition, inputClassName, className, name, validate, value, ...props } = this.props;

    return (
      <Field name={name} validate={validate} value={value}>
        {({ field, meta, form }: FieldProps<number>) => {
          let validationContent: React.ReactNode;
          let validationType: 'error' | undefined;
          let hasError = false;

          /**
           * Javascript string extend array of characters. If this field is part of a FieldArray, an error message on the parent path will be split up like an array.
           */
          if (meta.touched && meta.error !== undefined && typeof meta.error === 'string' && meta.error.length >= 2) {
            validationType = 'error';
            validationContent = <>{meta.error}</>;
            hasError = true;
          }
          return (
            <FormField
              validationType={validationType}
              validationContent={validationContent}
              label={label}
              labelPosition={labelPosition}
              htmlFor={field.name}
              className={cn('nlss-auto-complete-field', className)}>
              <UUIDAutoComplete
                {...props}
                name={field.name}
                value={field.value ?? ('' as any)}
                className={cn('nlss-auto-complete-field__input', inputClassName)}
                aria-invalid={hasError}
                onBlur={() => {
                  form.setFieldTouched(field.name, true);
                }}
                onChange={(_uuid: number | string | undefined) => {
                  const uuid: number | undefined = typeof _uuid === 'string' ? +_uuid : _uuid;
                  if (uuid !== field.value) {
                    form.setFieldValue(field.name, uuid);
                  }
                }}
              />
            </FormField>
          );
        }}
      </Field>
    );
  }
}

type Props = IUUIDAutoCompleteFieldProps;

export interface IUUIDAutoCompleteFieldProps extends Omit<IUUIDAutoCompleteProps, 'validation' | 'form' | 'onChange'> {
  name: string;
  inputClassName?: string;
  validate?: FieldValidator;
  label?: string;

  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
}
