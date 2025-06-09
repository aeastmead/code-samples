import React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import { searchEntitiesSelectors, SearchEntity } from './states';
import { useSelector } from 'react-redux';
import SearchCard from './SearchCard';

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 320px);
  grid-auto-rows: max-content;
  gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium};

  .nlss-searchCardGrid__cell {
    grid-column: span 1;
    grid-row: span 1;
    padding: 0 0 4px;
    display: flex;
    flex-direction: column;

    &:hover {
      padding: 0;
    }
  }
`;

function SearchCardGrid({ className, ...rest }: SearchCardGrid.Props) {
  const entities: SearchEntity[] = useSelector(searchEntitiesSelectors.getAll);

  return (
    <Container {...rest} className={cn('', className)}>
      {entities.map((entity: SearchEntity, index: number) => (
        <div key={index.toString()} className="nlss-searchCardGrid__cell">
          <SearchCard
            entityId={entity.id}
            entityType={entity.entityType}
            name={entity.name}
            alias={entity.alias}
            description={entity.description}
            approvers={entity.approvers}
            category={entity.category}
            resourceTypeIds={entity.resourceTypeIds}
            className="nlss-searchCardGrid__card"
          />
        </div>
      ))}
    </Container>
  );
}

namespace SearchCardGrid {
  export interface Props extends React.HTMLAttributes<HTMLDivElement> {}
}

export default SearchCardGrid;
