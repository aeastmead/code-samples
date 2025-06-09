import { ButtonProps, Button, Icon } from '@bbnpm/bb-ui-framework';
import { connect, FormikContextType } from 'formik';
import React from 'react';
import cn from 'classnames';

class SubmitButton extends React.PureComponent<Props> {
  static displayName = 'NLSSSubmitButton';

  constructor(props: Props) {
    super(props);
  }

  public render(): React.ReactNode | null {
    const {
      formik: { dirty, isValid },
      className,
      small: _small,
      ...props
    } = this.props;

    const small = _small === true;
    return (
      <Button
        {...props}
        disabled={!isValid || !dirty}
        type="submit"
        kind="primary"
        className={cn('nlss-submit-button', { 'nlss-submit-button--small': small }, className)}>
        {small ? <Icon name="checkmark" /> : 'Save'}
      </Button>
    );
  }
}

export default connect<ISubmitButtonProps>(SubmitButton);

type Props = ISubmitButtonProps & {
  formik: FormikContextType<any>;
};

export interface ISubmitButtonProps extends Omit<ButtonProps, 'kind' | 'type' | 'disabled'> {
  /**
   * true - Icon is used
   * false - 'Save' text
   *
   * {@default: false}
   */
  small?: boolean;
}
