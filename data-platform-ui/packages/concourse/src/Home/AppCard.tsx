import React from 'react';
import styled, { DefaultTheme, StyledComponent, StyledProps } from 'styled-components';
import cn from 'classnames';
import { Card, Icon } from '@bbnpm/bb-ui-framework';
import { appModuleConfigObj, AppModuleName } from '@nlss/brain-trust';

function InnerAppCard({ className, appName, ...rest }: AppCard.Props): React.ReactElement {
  const { displayName, iconName, kind, path } = React.useMemo(()=>appModuleConfigObj[appName],[appName]);
  return (
    <Card
      {...rest}
      className={cn(`nlss-appCard nlss-appCard--${kind}`, className)}
      onClick={() => {
        window.location.assign(path);
      }}>
      <div className="nlss-appCard__header">{displayName}</div>
      <Icon name={iconName} className="nlss-appCard__icon" />
    </Card>
  );
}

const AppCard: StyledComponent<React.FunctionComponent<AppCard.Props>, DefaultTheme> = styled(InnerAppCard)`
  width: 300px;
  border: 1px solid lightgrey;
  height: 210px;
  padding-top: ${({ theme }: StyledProps<AppCard.Props>) => theme.spacingSizes.large};
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;

  .bbui-card-children {
    height: unset;
  }

  .nlss-appCard {
    &__icon {
      display: flex;
      justify-content: center;
      width: 100%;
      color: ${({ theme, appName }: StyledProps<AppCard.Props>) => theme.subAppColors[appName]};
      svg {
        font-size: 98px;
      }
    }

    &__header {
      padding-bottom: ${({ theme }: StyledProps<AppCard.Props>) => theme.spacingSizes.small};
      font-size: 18px;
      font-weight: ${({ theme }: StyledProps<AppCard.Props>) => theme.fontWeights.medium};
      line-height: 24px;
      text-align: center;
    }
  }
`;

namespace AppCard {
  export interface Props extends Card.Props {
    appName: AppModuleName;
  }
}

export default AppCard;
