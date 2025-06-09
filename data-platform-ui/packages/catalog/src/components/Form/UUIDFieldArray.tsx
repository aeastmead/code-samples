import { Button, Icon } from '@bbnpm/bb-ui-framework';
import { FieldArray, FieldArrayRenderProps, FieldValidator, getIn } from 'formik';
import React from 'react';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import cn from 'classnames';
import isNil from 'lodash/isNil';
import range from 'lodash/range';
import Validator, { ValidatorFn } from '../../utils/validator';
import UUIDAutoCompleteField from './UUIDAutoCompleteField';
import { nlssUtils } from '@nlss/brain-trust';

const labelIdGen: nlssUtils.SimpleUniqueGenerator = nlssUtils.createSimpleUniqGen('nlss-uuid-flds');
export default class UUIDFieldArray extends React.PureComponent<Props> {
  static displayName = 'NLSSUUIDFieldArray';

  readonly labelId: string = labelIdGen();

  public render() {
    const {
      name,
      minimum,
      validateOnChange,
      fieldValidate,
      className,
      small: _small,
      fixedCount,
      label,
      ...props
    } = this.props;

    const validate: FieldValidator = !isNil(fieldValidate)
      ? Validator.compose(Validator.required, fieldValidate)
      : Validator.required;
    const small = _small === true;

    const adjustableRows = fixedCount !== true;
    return (
      <FieldArray name={name} validateOnChange={validateOnChange}>
        {({ form, push, remove }: FieldArrayRenderProps) => {
          const items: number[] = getIn(form.values, name);
          const fieldErrors: (string | undefined)[] | string | undefined = getIn(form.errors, name);
          const count = items.length;
          const canRemove = count > minimum;

          const error: string | undefined =
            typeof fieldErrors === 'string' && fieldErrors.length > 0 ? fieldErrors : undefined;
          const hasRootError = error !== undefined;
          return (
            <Container
              {...props}
              className={cn(
                'nlss-uuid-field-array',
                {
                  'nlss-uuid-field-array--adjustable': adjustableRows,
                  'nlss-uuid-field-array--small': small
                },
                className
              )}>
              {label && (
                <label id={this.labelId} className="nlss-uuid-field-array__label">
                  {label}
                </label>
              )}
              <div className={cn('nlss-uuid-field-array__content', { 'nlss-uuid-field-array__content--small': small })}>
                {range(count).map((_: number, index: number) => (
                  <div
                    className={cn('nlss-uuid-field-array__row', {
                      'nlss-uuid-field-array__row--adjustable': adjustableRows,
                      'nlss-uuidFieldArray--rootError': hasRootError
                    })}
                    key={index.toString()}>
                    <UUIDAutoCompleteField
                      className="nlss-uuid-field-array__field"
                      name={`${name}.${index}`}
                      validate={validate}
                      aria-labelledby={label && this.labelId}
                    />
                    {adjustableRows && (
                      <Button
                        className={cn('nlss-uuid-field-array__remove-btn', {
                          'nlss-uuid-field-array__remove-btn--disabled': !canRemove,
                          'nlss-uuid-field-array__remove-btn--small': small
                        })}
                        type="button"
                        kind="tertiary"
                        disabled={!canRemove}
                        onClick={remove.bind(null, index)}>
                        {small ? <Icon name="x" /> : 'remove'}
                      </Button>
                    )}
                  </div>
                ))}
                {error && <div className="nlss-uuidFieldArray__errorMsg">{error}</div>}
                {adjustableRows && (
                  <div className="nlss-uuid-field-array__add-row">
                    <Button
                      className={cn('nlss-uuid-field-array__add-btn', {
                        'nlss-uuid-field-array__add-btn--small': small
                      })}
                      type="button"
                      kind="primary"
                      onClick={push.bind(null, '')}>
                      {small ? <Icon name="plus" /> : 'Add'}
                    </Button>
                  </div>
                )}
              </div>
            </Container>
          );
        }}
      </FieldArray>
    );
  }
}

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;

  .nlss-uuid-field-array {
    &__row--adjustable {
      display: grid;
      grid-template-columns: 1fr min-content;
      grid-column-gap: 1rem;
    }

    &__label {
      padding-bottom: 1rem;
      font-weight: ${({ theme }) => theme.font.weight.demi};
    }
    &__content {
      display: grid;
      grid-auto-rows: minmax(71px, max-content);

      & > * {
        grid-row: span 1;
      }

      &--small {
        grid-row-gap: 0.25rem !important;
      }
    }
  }
  .nlss-uuidFieldArray {
    &__errorMsg {
      font-size: ${({ theme }: { theme: DefaultTheme }) => theme.fontSizes.medium};
      color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.error.text};
    }
    &--rootError .bbui-input-group {
      border-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.error.text};
    }
  }
`;

type Props = IUUIDFieldArrayProps;

export interface IUUIDFieldArrayProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  fieldValidate?: ValidatorFn;
  minimum: number;
  validateOnChange?: boolean;
  small?: boolean;
  fixedCount?: boolean;
  label?: string;
}
