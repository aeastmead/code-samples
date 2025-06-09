import cn from 'classnames';
import { useMemo } from 'react';
import type React from 'react';
import GreenplumLogo from './GreenplumLogo';
import QlikLogo from './QlikLogo';
import HiveLogo from './HiveLogo';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  width: 100%;
  height: 100%;
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &.nlss-resourceLogo--qvd {
    .nlss-resourceLogo__logo {
      max-height: calc(100% - 20px);
    }
  }

  .nlss-resourceLogo {
    &__label {
      padding-top: 4px;
      font-size: ${({ theme }: { theme: DefaultTheme }) => theme.fontSizes.small};
      font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.fontWeights.demi};
    }
  }
`;

function ResourceLogo({ className: _className, logo, hideName, ...rest }: ResourceLogo.Props) {
  const { Logo, displayName, title } = useMemo(() => ChildDefs[logo], [logo]);

  const showName = hideName !== true;
  return (
    <Container
      {...rest}
      title={title}
      className={cn(
        'nlss-resourceLogo',
        `nlss-resourceLogo--${logo}`,
        { [`nlss-resourceLogo--min`]: showName },
        _className
      )}>
      <Logo className={cn('nlss-resourceLogo__logo', `nlss-resourceLogo-logo--${logo}`)} />
      {showName && <div className="nlss-resourceLogo__label">{displayName}</div>}
    </Container>
  );
}

const ChildDefs: Record<ResourceLogo.LogoType, ChildDefinition> = {
  greenplum: {
    Logo: GreenplumLogo,
    displayName: 'Greenplum',
    title: 'Greenplum'
  },
  hive: {
    Logo: HiveLogo,
    displayName: 'Hive',
    title: 'Apache Hive'
  },
  qvd: {
    Logo: QlikLogo,
    displayName: 'QVD',
    title: 'Qlik QVD'
  }
};

type ChildDefinition = {
  Logo: React.FunctionComponent<React.HTMLAttributes<HTMLElement>>;
  displayName: string;
  title: string;
};

namespace ResourceLogo {
  export type LogoType = 'greenplum' | 'hive' | 'qvd';
  export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    logo: LogoType;
    hideName?: boolean;
  }

  export function typeForId(resourceId: number): LogoType | undefined {
    switch (resourceId) {
      case 2: {
        return 'hive';
      }
      case 8: {
        return 'qvd';
      }
      case 7: {
        return 'greenplum';
      }
    }
    return undefined;
  }

  export const Greenplum: React.FunctionComponent<GreenplumLogo.Props> = GreenplumLogo;

  export interface GreenplumProps extends GreenplumLogo.Props {}

  export const Qlik: React.FunctionComponent<QlikLogo.Props> = QlikLogo;

  export interface QlikProps extends QlikLogo.Props {}

  export const Hive: React.FunctionComponent<HiveLogo.Props> = HiveLogo;

  export interface HiveProps extends HiveLogo.Props {}
}

export default ResourceLogo;
