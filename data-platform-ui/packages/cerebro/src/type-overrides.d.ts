import type { ThemeProps } from 'styled-components';
import '@bbnpm/bb-ui-framework';
import type { NLSSTheme } from './theme';

declare module '@bbnpm/bb-ui-framework' {
  export interface ConsumerTheme extends NLSSTheme {}
}

declare module 'styled-components' {
  export interface DefaultTheme extends NLSSTheme {}

  export interface DefaultThemeProps extends ThemeProps<DefaultTheme> {}
}
