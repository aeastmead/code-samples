import type React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

const LinkCard: StyledComponent<'a', DefaultTheme> = styled.a.attrs(({ className }: LinkCard.Props) => ({
  className: cn('nlss-linkCard', className)
}))`
  background-color: ${({ theme }) => theme.colors.background};
  border-color: ${({ theme }) => theme.colors.text};
  border-style: solid;
  border-width: 1px 0 0 0;
  height: 100%;
  min-width: 300px;
  padding: 16px;
  outline: none;
  text-decoration: none;
  color: inherit;

  &:hover,
  &:focus {
    text-decoration: none;
    background-color: ${({ theme }) => theme.Card.colors.hoverBackground};
    border-color: ${({ theme }) => theme.colors.blue[400]};
    border-width: 6px 0 0 0;
    box-shadow: ${({ theme }) => theme.shadows.default};
    padding-top: 11px;
  }
  &:focus {
    outline: none;
  }
  &:visited,
  &:link,
  &:hover,
  &:focus {
    outline: none;
    text-decoration: none;
  }

  .bbui-card-children {
    display: flex;
    height: 100%;
    flex-direction: column;
    position: relative;
  }
`;

namespace LinkCard {
  export interface Props
    extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {}
}

export default LinkCard;
