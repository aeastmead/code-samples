import React from 'react';
import cn from 'classnames';
import { Notification } from '@bbnpm/bb-ui-framework';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import TitleBar from './TitleBar';

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  userName: string;
}

export default class Layout extends React.Component<LayoutProps> {
  private readonly _currentYear: number;

  constructor(props: LayoutProps) {
    super(props);

    this._currentYear = new Date().getFullYear();
  }

  public render(): React.ReactElement {
    const { className, children, userName, ...props } = this.props;
    return (
      <Container {...props} className={cn('nlss-layout', className)}>
        <Notification />
        <TitleBar className="nlss-layout__titleBar">
          <TitleBar.Node
            iconName="question-circle"
            label="Help"
            href="https://tutti.prod.bloomberg.com/datamarketplace/README"
            target="__blank"
            rel="noopener noreferrer"
          />
          <TitleBar.Node iconName="user" label={userName} />
        </TitleBar>
        <main role="main" className="nlss-layout__main">
          {children}
        </main>
        <footer className="nlss-layout__footer">&copy; {this._currentYear} Bloomberg L.P. All rights reserved.</footer>
      </Container>
    );
  }
}

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  overflow-y: visible;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};

  & > * {
    grid-column: 1;
  }

  & > div:first-child {
    grid-row: 1;
  }

  .nlss-layout {
    &__footer {
      height: 32px;
      grid-row: 3;
      background-color: ${({ theme }) => theme.layout.footerBackgroundColor};
      color: ${({ theme }) => theme.layout.footerFontColor};
      font-size: ${({ theme }) => theme.font.size.small};
      padding-left: 20px;
      display: flex;
      align-items: center;
    }
    &__main {
      width: 100%;
      position: relative;
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100vh - 92px);
    }

    &__titleBar {
      height: 60px;
    }
  }
  .bbui-titlebar-container {
    margin: 0;
  }
`;
