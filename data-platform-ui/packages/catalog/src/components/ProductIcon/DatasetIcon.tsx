import React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

export default function DatasetIcon({ className, primaryColor, ...props }: Props): React.ReactElement {
  return (
    <Container
      {...props}
      className={cn('nlss-dataset-icon', { 'nlss-dataset-icon--primary': primaryColor === true }, className)}
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38h-12v-15H7v9.07L8.5 18h6v4.5zm6-6h-12v-15H16V6h4.5v10.5z"></path>
    </Container>
  );
}

const Container: StyledComponent<'svg', DefaultTheme> = styled.svg`
  &.nlss-dataset-icon {
    &--primary {
      color: ${({ theme }) => theme.datasetColor};
    }
  }
`;

type Props = IDatasetIconProps;
export interface IDatasetIconProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  primaryColor?: boolean;
}
