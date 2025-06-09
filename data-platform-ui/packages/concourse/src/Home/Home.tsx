import React, { useMemo } from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent, ThemeProps } from 'styled-components';
import CollapsibleMessagePanel from './CollapsibleMessagePanel';
import { AppModuleConfig, appModuleConfigArray } from '@nlss/brain-trust';
import AppCard from './AppCard';
const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  width: 100%;
  display: grid;
  grid-template-rows: 160px 1fr;
  grid-row-gap: ${({ theme }: ThemeProps<DefaultTheme>) => theme.spacingSizes.large};
  grid-auto-flow: row;

  .nlss-home {
    &__banner,
    &__main {
      grid-row: span 1;
      grid-column: span 1;
    }

    &__main {
      padding: ${({ theme }: ThemeProps<DefaultTheme>) => `${theme.spacingSizes.large} ${theme.spacingSizes.large}`};
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .nlss-home-cardGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, max-content);
    grid-auto-rows: max-content;
    grid-auto-flow: column;
    overflow-wrap: normal;
    grid-gap: 48px;
  }
`;

function Home({ className, ...rest }: Home.Props): React.ReactElement {
  const message: string = useMemo(
    () => new Date().toLocaleDateString() + ' : Welcome to NLSS! Stay tuned for future updates..',
    []
  );

  return (
    <Container {...rest} className={cn('nlss-home', className)}>
      <CollapsibleMessagePanel className="nlss-home__banner" headerText="Updates and News" defaultOpen>
        {message}
      </CollapsibleMessagePanel>
      <div className="nlss-home__main">
        <div className="nlss-home-cards__content nlss-home-cardGrid">
          {appModuleConfigArray.map(({ kind }: AppModuleConfig) => (
            <AppCard key={kind} appName={kind} className="nlss-home-cardGrid__card" />
          ))}
        </div>
      </div>
    </Container>
  );
}

namespace Home {
  export interface Props extends React.HTMLAttributes<HTMLDivElement> {}
}

export default Home;
