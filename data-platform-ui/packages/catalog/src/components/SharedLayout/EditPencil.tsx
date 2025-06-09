import cn from 'classnames';
import React from 'react';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

export default function EditPencil({ className, ...props }: Props): React.ReactElement {
  return (
    <Container
      {...props}
      className={cn('nlss-edit-pencil', className)}
      viewBox="0 0 28 28"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M21.854.5l5.568 5.567-15.115 15.116-5.569-5.569L21.854.501zM.5 27.35l3.825-9.45 5.625 5.625L.5 27.35z" />
    </Container>
  );
}

EditPencil.displayName = 'NLSSEditPencil';

const Container: StyledComponent<'svg', DefaultTheme> = styled.svg`
  cursor: pointer;
  width: ${({ theme }) => theme.font.size.medium};
`;

type Props = IEditPencilProps;

export interface IEditPencilProps extends React.HTMLAttributes<HTMLOrSVGElement> {}
