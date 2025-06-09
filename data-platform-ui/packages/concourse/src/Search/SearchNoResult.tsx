import type React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import type { DefaultTheme, StyledComponent } from 'styled-components';

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  height: 65vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .nlss-searchNoResult__content {
    font-size: ${({ theme }: { theme: DefaultTheme }) => theme.fontSizes.xlarge};
    font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.fontWeights.demi};
  }
`;

function SearchNoResult({
  className,
  query,
  activeFilters,
  ...rest
}: SearchNoResult.Props): React.ReactElement<SearchNoResult.Props> {
  return (
    <Container {...rest} className={cn('nlss-searchNoResult', className)}>
      <div className="nlss-searchNoResult__content">{createLabel(query, activeFilters)}</div>
    </Container>
  );
}

function createLabel(query: string | undefined, activeFilters?: boolean): string {
  /**
   * Assuming if there is no query, all items should be displayed. The only reason for no items would have to be due to filters
   */

  let hasFilters = true;
  let result = 'No results found';
  if (query !== undefined) {
    hasFilters = activeFilters === true;
    result += ` for "${query}"`;
  }
  return hasFilters ? `${result} with current filters.` : result;
}

namespace SearchNoResult {
  export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    query?: string;
    activeFilters?: boolean;
  }
}

export default SearchNoResult;
