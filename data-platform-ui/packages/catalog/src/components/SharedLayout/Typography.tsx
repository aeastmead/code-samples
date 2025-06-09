import React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

export const PageTitle: StyledComponent<'h1', DefaultTheme, Record<string, any>, any> = styled.h1.attrs(
  ({ className }: IPageTitleProps) => ({
    className: cn('nlss-layout__page-title', className)
  })
)`
  font-weight: ${({ theme }) => theme.font.weight.medium};
  font-size: ${({ theme }) => theme.font.title};

  margin: 0;
  padding: 0;
  border: 0;
  vertical-align: baseline;
`;

PageTitle.displayName = 'NLSSPageTitle';

export type PageTitleComponentType = React.ComponentType<IPageTitleProps>;

export interface IPageTitleProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
  theme?: DefaultTheme;
}
