import React from 'react';
import { TitleBar as BBTitleBar } from '@bbnpm/bb-ui-framework';
import cn from 'classnames';
import TitleBarNode from './TitleBarNode';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

const Container: StyledComponent<React.ComponentType<BBTitleBar.Props>, DefaultTheme> = styled(BBTitleBar)`
  margin: 0;
  height: 60px;
  .bbui-titlebar-container {
    height: 100%;
  }

  .nlss-titlebar__links {
    height: 100%;
    display: grid;
    grid-auto-columns: minmax(32px, auto);
    grid-template-rows: 1fr;
    justify-content: flex-end;

    & > * {
      height: 100%;
      grid-row: 1;
      grid-column: span 1;
    }

    & > span {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .titlebar-icon-link {
      padding: 12px 16px 18px;
    }
  }
  .nlss-titlebar__searchBar {
    height: 100%;
    display: flex;
    justify-content: center;
  }

  .bbui-titlebar-iconlink-button {
    max-height: unset;
    padding: 12px 16px 18px;
    height: 100%;
    border: none;
  }
  .bbui-titlebar-iconlink-down {
    display: none;
  }
  .bbui-titlebar-brand-wrapper {
    padding-right: 8px;
  }
`;

class TitleBar extends React.PureComponent<TitleBar.Props> {
  public render() {
    const { className, userName, children, searchBar, ...rest } = this.props;
    return (
      <Container
        {...rest}
        productName="NLSS"
        className={cn('nlss-titlebar', className)}
        brandRenderer={({ children, className, ...brandProps }) => (
          <a {...brandProps} className={cn('nlss-titleBar-node__logoLink', className)} href="/">
            {children}
          </a>
        )}>
        {searchBar && <div className="nlss-titlebar__searchBar">{searchBar}</div>}
        <div className="nlss-titlebar__links">{children}</div>
      </Container>
    );
  }
}

namespace TitleBar {
  export interface Props extends Omit<BBTitleBar.Props, 'productName'> {
    userName?: string;
    searchBar?: React.ReactNode;
  }

  export const IconLink: React.ComponentType<BBTitleBar.IconLink.Props> = BBTitleBar.IconLink;

  export interface IconLinkProps extends BBTitleBar.IconLink.Props {}

  export const Node: React.ComponentType<TitleBarNode.Props> = TitleBarNode;

  export interface NodeProps extends TitleBarNode.Props {}
}

export default TitleBar;
