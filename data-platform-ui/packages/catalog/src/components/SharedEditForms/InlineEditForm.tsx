/* eslint-disable @typescript-eslint/no-unused-vars */
import { FieldValidator } from 'formik';
import { FormikErrors } from 'formik/dist/types';
import React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import { Form, FormButtons, IFormProps } from '../Form';

export type FormModel<Value> = {
  value: Value;
};

export interface IInlineEditFormProps<Value>
  extends Omit<IFormProps<FormModel<Value>>, 'initialValues' | 'onSubmit' | 'validate'> {
  initialValue?: Value;
  validate?: FieldValidator;

  formValidate?: (values: FormModel<Value>) => void | Record<string, any> | Promise<FormikErrors<FormModel<Value>>>;

  fieldClassName?: string;
  label?: string;
  labelPosition?: 'top' | 'right' | 'bottom' | 'left';

  onSubmit: (value: Value) => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

const InnerWrapper: StyledComponent<'div', DefaultTheme> = styled.div`
  @media screen and (max-width: ${({ theme }) => theme.breakPoints.md}px) {
    max-width: 400px;
  }

  @media screen and (min-width: ${({ theme }) => theme.breakPoints.md + 1}px) {
    max-width: 600px;
  }
`;

export default function InlineEditForm<Value>({
  onSubmit,
  onCancel,
  initialValue,
  className,
  children,
  fieldClassName,
  validate,
  formValidate,
  ...props
}: IInlineEditFormProps<Value>): React.ReactElement {
  return (
    <Form
      {...props}
      initialValues={{ value: initialValue as any } as any}
      onSubmit={(data: FormModel<Value>) => onSubmit(data.value)}
      validate={formValidate}
      className={cn('nlss-inline-edit-form', className)}>
      <InnerWrapper className="nlss-inline-edit-form__wrapper">
        {children}
        <FormButtons onCancel={onCancel} small />
      </InnerWrapper>
    </Form>
  );
}
