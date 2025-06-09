import React from 'react';
import { BBUIApp, Content, Footer, Main } from '@bbnpm/bb-ui-framework';
import { nlssLightTheme } from './theme';
import TitleBar from './TitleBar';
import TitleBarAppMenu from './TitleBarAppMenu';
import GlobalStyle from './GlobalStyle';
import Bodyguard from './Bodyguard';
import { HistorySearchBar, StdSearchBar } from './SearchBar';

function NLSSApp({ children, navigationBar, searchResultApp = false, ...rest }: NLSSApp.Props): React.ReactElement {
  return (
    <Bodyguard>
      {(userName: string) => (
        <BBUIApp {...rest} themes={[nlssLightTheme]} activeTheme="nlssLightTheme">
          <GlobalStyle />
          <TitleBar searchBar={searchResultApp ? <HistorySearchBar /> : <StdSearchBar />}>
            <TitleBarAppMenu />
            <TitleBar.Node
              iconName="question-circle"
              label="Help"
              href="https://tutti.prod.bloomberg.com/datamarketplace/README"
              target="__blank"
              rel="noopener noreferrer"
            />
            <TitleBar.Node iconName="user" label={userName} />
          </TitleBar>
          <>{navigationBar}</>
          <Main>
            <Content>{children}</Content>
          </Main>
          <Footer copyright={new Date().getFullYear()} />
        </BBUIApp>
      )}
    </Bodyguard>
  );
}

namespace NLSSApp {
  export interface Props extends Omit<BBUIApp.Props, 'themes' | 'activeTheme'> {
    children?: React.ReactNode;
    navigationBar?: React.ReactNode;
    searchResultApp?: boolean;
  }
}

export default NLSSApp;
