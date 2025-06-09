/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import cn from 'classnames';

import isNil from 'lodash/isNil';

import { Form, FormButtons, IFormProps, UUIDFieldArray } from '../Form';

export default class PeopleEditForm extends React.PureComponent<Props> {
  static displayName = 'NLSSPeopleEditForm';

  private _initialValues: FormModel = {
    value: []
  };

  private _initialized = false;
  constructor(props: Props) {
    super(props);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  public componentWillUnmount() {
    this._initialized = false;
    this._initialValues = {
      value: []
    };
  }

  public render(): React.ReactNode | null {
    const {
      initialValue,
      loading,
      minimum,
      fieldClassName,
      className,
      saved,
      onSubmit,
      onCancel,
      onComplete,
      fixedCount,
      ...props
    } = this.props;

    if (loading === true) {
      return null;
    }

    if (!this._initialized) {
      this._initialValues = PeopleEditForm._getInitialValue(minimum, initialValue);
      this._initialized = true;
    }

    return (
      <Form
        {...props}
        className={cn('nlss-people-edit-form', className)}
        saved={saved}
        onSubmit={this._handleSubmit}
        onComplete={onComplete}
        initialValues={this._initialValues}
        validate={PeopleEditForm._uniqueValues}>
        <UUIDFieldArray
          small
          name="value"
          minimum={minimum}
          fixedCount={fixedCount}
          className={cn('nlss-people-edit-form__fields', fieldClassName)}
        />
        <FormButtons small className="nlss-people-edit-form__buttons" onCancel={onCancel} />
      </Form>
    );
  }

  private _handleSubmit(model: FormModel): void {
    this.props.onSubmit(model.value);
  }

  private static _uniqueValues({ value: uuids }: FormModel) {
    if (uuids.length <= 1) {
      return undefined;
    }
    // const prevValues: {[uuid: number]: boolean} = {};
    let hasErrors = false;
    const errors: (string | undefined)[] = [];
    const prevItems: { [uuid: number]: boolean } = {};

    if (!isNil(uuids[0])) {
      prevItems[uuids[0]] = true;
    }

    for (let i = 1; i < uuids.length; i++) {
      if (isNil(uuids[i])) {
        continue;
      }
      const uuid = +uuids[i];
      if (prevItems[uuid]) {
        hasErrors = true;
        errors[i] = 'Value must be unique';
      }
      prevItems[uuid] = true;
    }

    return hasErrors ? { value: errors } : undefined;
  }

  private static _getInitialValue(minimum: number, initialValue?: number[]): FormModel {
    const value: number[] = !isNil(initialValue) ? [...initialValue] : [];

    if (value.length < minimum) {
      value.length = minimum;
    }

    return {
      value
    };
  }
}

type Props = IPeopleEditFormProps;

type FormModel = {
  value: number[];
};

export interface IPeopleEditFormProps extends Omit<IFormProps<FormModel>, 'initialValues' | 'onSubmit' | 'validate'> {
  initialValue?: number[];

  loading?: boolean;

  minimum: number;

  /**
   * If true, add and removed buttons are not displayed. Number of rows will default to the minimum.
   */
  fixedCount?: boolean;

  fieldClassName?: string;

  onSubmit: (value: number[]) => void;
  onCancel: () => void;
  onComplete?: () => void;
}
