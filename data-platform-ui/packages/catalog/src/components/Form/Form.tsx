import { Formik, FormikConfig, FormikHelpers, FormikProps } from 'formik';
import React from 'react';
import isNil from 'lodash/isNil';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import cn from 'classnames';
import { PageTitle } from '../SharedLayout';

/**
 * Formik wrapper
 */
export default class Form<TValues extends Record<string, any>> extends React.PureComponent<Props<TValues>> {
  private _initialized: boolean = false;

  private _submitResolver: (() => void) | undefined;

  constructor(props: Props<TValues>) {
    super(props);

    this._endSubmit = this._endSubmit.bind(this);

    this._handleSubmit = this._handleSubmit.bind(this);
  }

  public componentDidUpdate({ hasRootError: prevHasRootError, saved: prevSaved }: Readonly<Props<TValues>>): void {
    const { hasRootError, saved } = this.props;
    if (!this._initialized) {
      return;
    }

    if (saved && saved !== prevSaved) {
      this._endSubmit();
      this.props.onComplete && this.props.onComplete();
    } else if (hasRootError === true && hasRootError !== prevHasRootError) {
      this._endSubmit();
    }
  }

  public componentWillUnmount() {
    this._endSubmit();
    this._initialized = false;
  }

  public render() {
    const {
      children,
      loading,
      initialValues,
      validate,
      onSubmit,
      onReset,
      validateOnBlur,
      validateOnChange,
      enableReinitialize,
      validateOnMount,
      validationSchema,
      className,
      rootError,
      hasRootError,
      onComplete,
      formTitle,
      fullPage,
      headerElement,
      ...props
    } = this.props;

    if (isNil(initialValues) || (!this._initialized && loading === true)) {
      return null;
    }

    this._initialized = true;

    return (
      <Formik
        validate={validate}
        onSubmit={this._handleSubmit}
        onReset={onReset}
        validateOnBlur={validateOnBlur}
        validateOnChange={validateOnChange}
        enableReinitialize={enableReinitialize}
        validateOnMount={validateOnMount}
        validationSchema={validationSchema}
        initialValues={initialValues}>
        {(formik: FormikProps<TValues>) => {
          const showSubmitError = !formik.isSubmitting && hasRootError === true && !isNil(rootError);
          return (
            <Container
              {...props}
              className={cn(
                'nlss-form',
                {
                  'nlss-form--submitting': formik.isSubmitting,
                  'nlss-form--error': showSubmitError,
                  'nlss-form--full-page': fullPage
                },
                className
              )}
              onSubmit={formik.handleSubmit}
              onReset={formik.handleReset}>
              {(formTitle || showSubmitError || headerElement) && (
                <div className={cn('nlss-form__title-bar', { 'nlss-form__title-bar--full': fullPage })}>
                  {formTitle && <PageTitle className="nlss-form__title">{formTitle}</PageTitle>}
                  {showSubmitError && <div className="nlss-form__root-error">{rootError}</div>}
                  {headerElement}
                </div>
              )}
              <div className={cn('nlss-form__content', { 'nlss-form__content--full-page': fullPage })}>{children}</div>
            </Container>
          );
        }}
      </Formik>
    );
  }

  private _handleSubmit(values: TValues, _: FormikHelpers<TValues>): void | Promise<void> {
    const submitPromise: Promise<void> = new Promise<void>(resolve => {
      this._submitResolver = resolve;
    });

    this.props.onSubmit(values);

    return submitPromise;
  }

  /**
   * Clears any active submit promises
   * @private
   */
  private _endSubmit(): void {
    this._submitResolver && this._submitResolver();
    this._submitResolver = undefined;
  }
}

const Container: StyledComponent<'form', DefaultTheme> = styled.form`
  width: 100%;
  min-height: 100%;
  position: relative;
  display: grid;
  grid-template-rows: minmax(50px, max-content) 1fr;
  grid-row-gap: 2rem;

  &.nlss-form {
    &__content {
      min-width: 100%;
    }
    &--submitting {
      display: none;
    }

    &--full-page {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 ${({ theme }) => theme.layout.gridSideOffset};

      grid-template-rows: minmax(75px, max-content) 1fr;

      .nlss-form-buttons {
        justify-content: center;
      }
    }
  }

  .nlss-form {
    &__content {
      width: 100%;
      grid-row: span 1;

      &--full-page {
        display: grid;
        grid-auto-flow: row;
        grid-row-gap: 2rem;
      }
    }
    &__title-bar {
      grid-row: span 1;
    }

    &__title {
      padding-bottom: 16px;
    }

    &__root-error {
      // use color from theme.
      color: ${({ theme }) => theme.colors.error.text};
    }
  }
`;

type Props<TValues extends Record<string, any>> = IFormProps<TValues>;

export interface IFormProps<TValues extends Record<string, any>>
  extends Omit<React.HTMLAttributes<HTMLFormElement>, 'children' | 'onLoad' | 'onUnload' | 'onSubmit' | 'onReset'>,
    Omit<FormikConfig<TValues>, 'initialValues' | 'component' | 'render' | 'children' | 'onSubmit'> {
  initialValues?: TValues;

  /**
   * Loading for initial values only. It will be ignored once initial values are provided
   */
  loading?: boolean;

  formTitle?: string;
  fullPage?: boolean;

  saved: boolean;

  hasRootError?: boolean;
  /**
   * Form level error
   */
  rootError?: string;

  /**
   * Called after save completes
   */
  onComplete?: () => void;

  onSubmit: (values: TValues) => void;

  headerElement?: React.ReactNode;
}
