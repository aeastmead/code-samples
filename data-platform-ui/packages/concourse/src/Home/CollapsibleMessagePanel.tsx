import React, { useMemo, useState } from 'react';
import styled, { DefaultTheme, StyledComponent, ThemeProps } from 'styled-components';
import cn from 'classnames';
import { Icon } from '@bbnpm/bb-ui-framework';

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .nlss-msgPanel {
    &__header {
      flex-basis: 40px;
      background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.amber[400]};
      font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.fontWeights.bold};

      cursor: pointer;
    }
    &__body {
      flex: 1 1 110px;
      text-align: center;
      font-size: ${({ theme }: ThemeProps<DefaultTheme>) => theme.fontSizes.xxlarge};
      padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium}
        ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.large};
      overflow-x: hidden;
      overflow-y: auto;
      overflow-wrap: normal;
      background-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.amber[200]};

      &--hidden {
        display: none;
      }
    }
  }

  .nlss-msgPanel-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    &__main {
      padding: ${({ theme }: ThemeProps<DefaultTheme>) => theme.spacingSizes.xsmall} 20px;
    }

    &__icon {
      padding: 0 20px;
    }
  }
`;

let panelUnqIdMaker = 1;

function CollapsibleMessagePanel({ className, children, defaultOpen, headerText, ...rest }: CollapsibleMessagePanel.Props) {
    const [open, setOpen] = useState(defaultOpen !== false);

    const panelId: string = useMemo(() => {
      return `nlss-msg-panel-content-${++panelUnqIdMaker}`;
    }, []);

    return (
      <Container {...rest} className={cn('nlss-msgPanel', { 'nlss-msgPanel--close': !open }, className)}>
        <div
          role="button"
          aria-expanded={open}
          aria-controls={panelId}
          className="nlss-msgPanel__header nlss-msgPanel-header"
          onClick={() => {
            setOpen(!open);
          }}>
          <div className="nlss-msgPanel-header__main">{headerText}</div>
          <Icon name={open ? 'chevron-up' : 'chevron-down'} className="nlss-msgPanel-header__icon" />
        </div>
        <div
          id={panelId}
          aria-hidden={!open}
          className={cn('nlss-msgPanel__body', { 'nlss-msgPanel__body--hidden': !open })}>
          {children}
        </div>
      </Container>
    );
}

namespace CollapsibleMessagePanel {
  export interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> {
    headerText?: string;
    defaultOpen?: boolean;
  }
}

export default CollapsibleMessagePanel;
