import { Button, Icon } from '@bbnpm/bb-ui-framework';
import React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import SubmitButton from './SubmitButton';

export default function FormButtons({ small: _small, className, onCancel, ...props }: Props): React.ReactElement {
  const small = _small === true;

  return (
    <Container {...props} className={cn('nlss-form-buttons', { 'nlss-form-buttons--small': small }, className)}>
      <Button
        onClick={onCancel}
        type="button"
        kind="tertiary"
        className={cn('nlss-form-buttons__cancel-button', { 'nlss-form-buttons__cancel-button--small': small })}>
        {small ? <Icon name="close" /> : 'Cancel'}
      </Button>
      <SubmitButton className="nlss-form-buttons__submit" small={small} />
    </Container>
  );
}

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  .nlss-form-buttons {
    margin-left: 10px;
  }
`;

export interface IFormButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * If set to true, both buttons use an Icon. When false or undefined, 'Save' and 'Canceled' is displayed
   */
  small?: boolean;
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
}

type Props = IFormButtonsProps;
