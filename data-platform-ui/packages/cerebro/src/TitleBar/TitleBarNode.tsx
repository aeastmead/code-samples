import React from 'react';
import { Icon, IconNames } from '@bbnpm/bb-ui-framework';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

interface InnerTitleBarNodeProps extends React.HTMLAttributes<HTMLElement> {
  iconName: IconNames;
  label?: string;
  href?: string;
  target?: string;
  rel?: string;
}

function InnerTitleBarNode({ iconName, label, className, ...rest }: InnerTitleBarNodeProps) {
  const isLink = rest.href !== undefined;
  const Wrapper: 'div' | 'a' = isLink ? 'a' : 'div';
  return (
    <Wrapper {...rest} className={cn('nlss-titleBar-node', { 'nlss-titleBar-node--link': isLink }, className)}>
      <div className="nlss-titleBar-node__aviator">
        <Icon name={iconName} />
      </div>
      {label && <div className="nlss-titleBar-node__label">{label}</div>}
    </Wrapper>
  );
}

const TitleBarNode: StyledComponent<React.ComponentType<InnerTitleBarNodeProps>, DefaultTheme> = styled<
  React.ComponentType<InnerTitleBarNodeProps>
>(InnerTitleBarNode)`
  height: 100%;
  padding: 12px 16px 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.header.colors.iconLink.text};
  overflow: hidden;

  &.nlss-titleBar-node--link {
    cursor: pointer;

    text-decoration: none;
    &:visited,
    &:hover,
    &:focus,
    &:active {
      outline: none;
      color: ${({ theme }) => theme.header.colors.iconLink.text};
    }
    &:hover {
      background-color: ${({ theme }) => theme.header.colors.iconLink.hover};
    }
  }

  .nlss-titleBar-node {
    &__aviator {
      grid-row: 1;
      text-align: center;
      padding-bottom: 4px;
    }

    &__label {
      grid-row: 2;
      grid-column: 1;
      text-align: center;
    }
  }
`;

namespace TitleBarNode {
  export interface Props extends InnerTitleBarNodeProps {}
}

export default TitleBarNode;
