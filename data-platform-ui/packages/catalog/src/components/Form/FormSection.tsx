import React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

export default function FormSection({ sectionTitle, className, children, ...props }: Props): React.ReactElement {
  return (
    <Container {...props} className={cn('nlss-form-section', className)}>
      {sectionTitle && <h4 className="nlss-form-section__title">{sectionTitle}</h4>}
      <div className="nlss-form-section__content nlss-grid">{children}</div>
    </Container>
  );
}

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .nlss-form-section {
    &__content {
      min-height: 100%;
    }
    &__title {
      font-size: ${({ theme }) => theme.font.size.large};
      font-weight: ${({ theme }) => theme.font.weight.medium};
      padding-bottom: 1rem;
    }
  }
`;

type Props = IFormSectionProps;

export interface IFormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  sectionTitle?: string;
}

export type FormLayoutSectionType = React.ComponentType<Props>;
