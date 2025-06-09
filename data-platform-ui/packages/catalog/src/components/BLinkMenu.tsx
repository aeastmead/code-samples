import React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import type { StyledComponent, DefaultTheme } from 'styled-components';
import { Icon } from '@bbnpm/bb-ui-framework';
import useCopyToClipboard from './useCopyToClipboard';
import isNil from 'lodash/isNil';

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  display: grid;

  padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.small}
    ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium};
  height: 50px;
  grid-template-columns: 40px 30px 120px;
  grid-template-rows: 1fr;
  grid-column-gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.small};

  .nlss-blinkMenu__action {
    color: ${({ theme }) => theme.links.colors.default};
    text-decoration: none;

    font-weight: ${({ theme }) => theme.font.weight.medium};
    &:visited {
      color: ${({ theme }) => theme.links.colors.default};
      text-decoration: none;
    }
    &:focus,
    &:hover {
      color: ${({ theme }) => theme.links.colors.default};
      text-decoration: none;
    }

    &:first-child {
      grid-column: 1/2;
      grid-row: 1/2;
    }

    &:last-child {
      grid-column: 3/4;
      grid-row: 1/2;

      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .nlss-blinkMenu-action {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 20px max-content;
    grid-column-gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.xsmall};
    &__icon {
      grid-column: 1/2;
      grid-row: 1/2;
      display: flex;
      align-items: center;
    }

    &__text {
      grid-column: 2/3;
      grid-row: 1/2;
      display: flex;
      align-items: center;
    }
  }
  .nlss-blinkMenu__or {
    grid-column: 2/3;
    grid-row: 1/2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  button {
    all: unset;
  }
`;

function BLinkMenu({ className, onClick, terminalFunction, url, ...rest }: BLinkMenu.Props): React.ReactElement {
  const [isCopying, onCopy]: [isCopying: boolean, onCopy: (copyText: string) => void] = useCopyToClipboard();

  return (
    <Container {...rest} className={cn('nlss-bLinkMenu', className)}>
      {isNil(onClick) ? (
        <a
          className="nlss-blinkMenu__action nlss-blinkMenu-action"
          target="_blank"
          rel="noopener noreferrer"
          href={url}>
          <Icon className="nlss-blinkMenu-action__icon" name="link" />
          <span className="nlss-blinkMenu-action__text">GO</span>
        </a>
      ) : (
        <button type="button" className="nlss-blinkMenu__action nlss-blinkMenu-action" onClick={() => onClick(true)}>
          <Icon className="nlss-blinkMenu-action__icon" name="link" />
          <span className="nlss-blinkMenu-action__text">GO</span>
        </button>
      )}
      <div className="nlss-blinkMenu__or">or</div>
      <button
        type="button"
        className="nlss-blinkMenu__action  nlss-blinkMenu-action"
        onClick={() => {
          if (!isNil(onClick)) {
            return onClick(false);
          }
          !isCopying && onCopy(terminalFunction);
        }}>
        <Icon name="duplicate" className="nlss-blinkMenu-action__icon" />
        <span className="nlss-blinkMenu-action__text">Copy Function</span>
      </button>
    </Container>
  );
}

namespace BLinkMenu {
  export interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
    onClick?: ClickHandler;
    terminalFunction: string;
    url: string;
  }

  export interface ClickHandler {
    (isURLClick: boolean): void;
  }
}

export default BLinkMenu;
