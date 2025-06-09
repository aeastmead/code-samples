import React from 'react';
import { TitleBar } from '@bbnpm/bb-ui-framework';
import cn from 'classnames';
import { AppModuleConfig, appModuleConfigArray } from '@nlss/brain-trust';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

type MenuItems = Required<TitleBar.IconLink.Props>['menuItems'];

const MENU_ITEMS: MenuItems = appModuleConfigArray.reduce(
  (accum: MenuItems, { displayName: label, path: href, kind, subPaths }: AppModuleConfig) => {
    accum.push({
      label,
      renderer: 'a',
      href,
      key: kind,
      className: 'nlss-titleBarApps__link'
    });

    if (subPaths !== undefined) {
      const maxIndex = subPaths.length - 1;
      for (let i = 0; i <= maxIndex; i++) {
        const item: AppModuleConfig.SubPath = subPaths[i];
        accum.push({
          label: item.displayName,
          renderer: 'a',
          href: item.path,
          className: cn('nlss-titleBarApps__subLink', {
            'nlss-titleBarApps__subLink--first': i === 0,
            'nlss-titleBarApps__subLink--last': i === maxIndex
          })
        });
      }
    }

    return accum;
  },
  []
);

const Container: StyledComponent<React.ComponentType<TitleBar.IconLink.Props>, DefaultTheme> = styled(
  TitleBar.IconLink
)`
  .nlss-titleBarApps {
    &__subLink {
      padding-left: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.large};

      &--first {
        margin-top: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.small};
      }

      &--last {
        margin-bottom: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.small};
      }
    }
  }
`;

function TitleBarAppMenu({ className, ...rest }: TitleBarAppMenu.Props): React.ReactElement {
  return (
    <Container {...rest} iconName="apps" menuItems={MENU_ITEMS} className={cn('nlss-titleBar-sppMenu', className)} />
  );
}

namespace TitleBarAppMenu {
  export interface Props extends Omit<TitleBar.IconLink.Props, 'menuItems' | 'iconName'> {}
}

export default TitleBarAppMenu;
