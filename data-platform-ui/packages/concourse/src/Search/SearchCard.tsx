import React, { useMemo } from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import { LinkCard, ResourceLogo } from '@nlss/cerebro';
import { Card } from '@bbnpm/bb-ui-framework';
import { SearchEntityType } from './utils';

const Container: StyledComponent<React.ComponentType<LinkCard.Props>, DefaultTheme> = styled(LinkCard)`
  border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.colors.grey[200]};
  display: grid;
  grid-template-rows: 25px 78px 120px 110px;
  padding: 0 0 16px;
  position: relative;

  &:visited,
  &:link,
  &:hover,
  &:focus {
    padding-top: 0;
  }

  & > *:not(:first-child) {
    overflow-wrap: normal;
    white-space: normal;
  }

  .bbui-card-header {
    grid-row: 2;
    overflow: hidden;
    display: grid;
    grid-auto-flow: row dense;
    grid-row-gap: 8px;
    padding: 8px 16px 0;
  }

  .bbui-card-title {
    text-transform: uppercase;
    padding: 0;
    overflow: hidden;
  }

  .bbui-card-content {
    grid-row: 3;
    height: 120px;
    padding: 14px 16px;
    display: block; /* Fallback for non-webkit */
    display: -webkit-box;
    line-height: 1.25;
    -webkit-line-clamp: 7;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
  }

  .nlss-searchCard-type {
    grid-row: 1;
    display: grid;
    grid-template-columns: 16px 1fr;
    grid-column-gap: 8px;
    justify-content: center;
    align-items: center;
    padding-left: 16px;
    line-height: 1;
    font-size: ${({ theme }: { theme: DefaultTheme }) => theme.fontSizes.small};
    font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.fontWeights.medium};
    color: #fff;

    svg {
      width: 1em;
      height: 1em;
      stroke: currentColor;
    }

    &--resource {
      background: #ffb04c;
      color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.black};
    }

    &--dataset {
      background: #4ea69f;
    }

    &__icon {
      stroke: white;
      stroke-width: 2px;
    }

    &__label {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .nlss-searchCard-footer {
    height: 100%;
    width: 100%;
    grid-row: 4/5;
    margin-top: 0;
    padding: 0 ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium};
    font-size: ${({ theme }: { theme: DefaultTheme }) => theme.fontSizes.base};

    display: grid;
    grid-template-rows: 50px max-content;
    grid-template-columns: 1fr;
    grid-row-gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium};
    flex-direction: column;

    &__approver {
      grid-row: 1/2;
      grid-column: span 1;
      overflow: hidden;
      overflow-wrap: normal;
    }

    &__logos {
      height: 60px;
      grid-row: 2/3;
      grid-column: span 1;
      overflow: hidden;

      display: grid;
      grid-template-columns: repeat(auto-fill, 60px);
      grid-auto-rows: 45px;
      grid-column-gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.small};
      justify-content: center;
    }
  }

  &.nlss-searchCard {
    &--resource:hover {
      border-color: #ffb04c;
    }

    &--dataset:hover {
      border-color: #4ea69f;
    }
  }
`;

function SearchCard({
  className,
  entityId,
  name,
  alias,
  entityType,
  description,
  category,
  approvers,
  resourceTypeIds,
  ...rest
}: SearchCard.Props) {
  const url: string = useMemo(
    () => `/catalog/${entityType === SearchEntityType.DATASET ? 'dataset' : 'resource'}/${entityId}`,
    [entityType, entityId]
  );

  const isResource = entityType === SearchEntityType.RESOURCE;
  return (
    <Container
      {...rest}
      href={url}
      className={cn('nlss-searchCard', `nlss-searchCard--${isResource ? 'resource' : 'dataset'}`, className)}>
      {isResource ? (
        <div className="nlss-searchCard-type nlss-searchCard-type--resource">
          <svg className="nlss-searchCard-type__icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4 1L3 2v12l1 1h9l1-1V5l-.293-.707-3-3L10 1H4zm0 13V2h5v4h4v8H4zm9-9l-3-3v3h3z"
            />
          </svg>
          <div className="nlss-searchCard-type__label">Resource</div>
        </div>
      ) : (
        <div className="nlss-searchCard-type nlss-searchCard-type--dataset">
          <svg className="nlss-searchCard-type__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38h-12v-15H7v9.07L8.5 18h6v4.5zm6-6h-12v-15H16V6h4.5v10.5z" />
          </svg>

          <div className="nlss-searchCard-icon__label">Dataset</div>
        </div>
      )}
      <Card.Header className="nlss-searchCard-header">
        <Card.SubTitle>{category}</Card.SubTitle>
        <Card.Title>{alias || name}</Card.Title>
      </Card.Header>
      <Card.Content>{description}</Card.Content>
      <Card.Footer className="nlss-searchCard__footer nlss-searchCard-footer">
        <div className="nlss-searchCard-footer__approver">Approvers: {approvers && approvers.join(', ')}</div>
        <div className="nlss-searchCard-footer__logos">
          {resourceTypeIds &&
            resourceTypeIds.map((resourceTypeId: number, index: number) => {
              const logo: ResourceLogo.LogoType | undefined = ResourceLogo.typeForId(resourceTypeId);
              if (logo === undefined) {
                return null;
              }
              return <ResourceLogo key={index.toString()} logo={logo} />;
            })}
        </div>
      </Card.Footer>
    </Container>
  );
}

namespace SearchCard {
  export interface Props extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    entityId: number;
    name: string;
    category: string;
    alias?: string;
    entityType: SearchEntityType;
    description?: string;
    approvers?: string[];
    resourceTypeIds?: number[];
  }
}

export default SearchCard;
