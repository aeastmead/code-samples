import React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import ProductIcon from '../ProductIcon';

export default function DatasetResourceNameCell({ className, children, ...props }: Props): React.ReactElement {
  return (
    <Container {...props} className={cn('nlss-dataset-resource-name-cell', className)}>
      <ProductIcon primaryColor className="nlss-dataset-resource-name-cell__icon" resource />

      <span className="nlss-dataset-resources__name-text">{children}</span>
    </Container>
  );
}

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  width: 100%;
  min-height: auto;
  display: flex;
  align-items: center;

  .nlss-dataset-resource-name-cell {
  }
`;

type Props = IDatasetResourceNameCellProps;

export interface IDatasetResourceNameCellProps extends React.HTMLAttributes<HTMLDivElement> {}
