import React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

export default function ResourceIcon({ className, primaryColor, ...props }: Props): React.ReactElement {
  return (
    <Container
      {...props}
      className={cn('nlss-resource-icon', { 'nlss-resource-icon--primary': primaryColor === true }, className)}
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 1L3 2v12l1 1h9l1-1V5l-.293-.707-3-3L10 1H4zm0 13V2h5v4h4v8H4zm9-9l-3-3v3h3z"></path>
    </Container>
  );
}

const Container: StyledComponent<'svg', DefaultTheme> = styled.svg`
  &.nlss-resource-icon {
    &--primary {
      color: ${({ theme }) => theme.resourceColor};
    }
  }
`;

type Props = IResourceIconProps;
export interface IResourceIconProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  primaryColor?: boolean;
}
