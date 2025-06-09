import React from 'react';
import { MenuPopout } from '@bbnpm/bb-ui-framework';
import cn from 'classnames';
import isNil from 'lodash/isNil';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import BLinkMenu from './BLinkMenu';

export interface IBlinkProps extends React.HTMLAttributes<HTMLDivElement> {
  url?: string;
  linkFunction?: string;
  displayText?: string;
  disableGo?: boolean;
  onMenuLinkClick?: (isUrl: boolean) => void;
}

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  width: 100%;
  background: transparent;

  .tippy-content {
    display: flex;

    & > {
      flex-grow: 1;
    }
  }

  .nlss-blink {
    &__text {
      color: ${({ theme }) => theme.links.colors.default};
      text-decoration: none;
      font-weight: ${({ theme }) => theme.font.weight.medium};
      padding: 4px 0;
      cursor: pointer;

      &:hover {
        color: ${({ theme }) => theme.links.colors.hover};
      }

      &:visited {
        color: ${({ theme }) => theme.links.colors.visited};
      }
    }
    &__menu {
      padding: 8px 16px;
      height: 50px;
      width: 250px;
      display: grid;
      grid-template-columns: repeat(3, auto);
      grid-template-rows: 1fr;
      grid-column-gap: 8px;
    }

    &__splitter {
      grid-column: span 1;
      grid-row: 1;
      width: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &__action {
      grid-column: span 1;
      grid-row: 1;
      display: flex;
      align-items: center;

      color: ${({ theme }) => theme.links.colors.default};
      text-decoration: none;

      &--link:hover {
        color: ${({ theme }) => theme.links.colors.hover};
      }

      &:last-child {
        justify-content: flex-end;
      }
    }

    &__icon {
      padding: 4px 8px 4px 0;
    }
  }
`;

export default function Blink({
  url,
  linkFunction,
  displayText: _displayTxt,
  className,
  disableGo,
  onMenuLinkClick,
  ...rest
}: IBlinkProps): React.ReactElement | null {
  if (isNil(linkFunction)) {
    return null;
  }
  const displayText: string = !isNil(_displayTxt)
    ? _displayTxt
    : `{${decodeURIComponent(linkFunction.toUpperCase())} <GO>}`;

  if (isNil(url)) {
    url = `https://blinks.bloomberg.com/screens/${encodeURIComponent(linkFunction)}`;
  }

  return (
    <Container {...rest} className={cn('nlss-blink', className)}>
      <MenuPopout
        content={<BLinkMenu onClick={onMenuLinkClick} terminalFunction={linkFunction} url={url} />}
        className="nlss-blink-menu-rap"
        maxWidth="250"
        placement="bottom-start"
        boundary="viewport"
        trigger="mouseenter"
        targetProps={{ className: 'nlss-blink__text' }}>
        {displayText}
      </MenuPopout>
    </Container>
  );
}

Blink.displayName = 'NLSSBlink';
