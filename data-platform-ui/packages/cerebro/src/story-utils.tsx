import { ThemeBoundary } from '@bbnpm/bb-ui-framework';
import { DecoratorFn } from '@storybook/react';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

export const darkThemeDecorator: DecoratorFn = Story => (
  <ThemeBoundary theme="dark">
    <Container>
      <Story />
    </Container>
  </ThemeBoundary>
);
const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
  display: flex;
  flex-direction: column;
`;
