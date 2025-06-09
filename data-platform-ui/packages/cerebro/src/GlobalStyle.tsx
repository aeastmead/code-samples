import { createGlobalStyle, DefaultTheme, GlobalStyleComponent, ThemeProps } from 'styled-components';

type Props = ThemeProps<DefaultTheme>;

const GlobalStyle: GlobalStyleComponent<Props, DefaultTheme> = createGlobalStyle<Props>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  html {
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
    -moz-tab-size: 4; 
    tab-size: 4;
    margin: 0;
    padding: 0;
    font-size: ${({ theme }: Props) => theme.rootFontSize};
  }
  body {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    font-size: ${({ theme }: Props) => theme.fontSizes.base};
  }

  #root {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }
`;
GlobalStyle.displayName = 'NLSSGlobalStyle';

export default GlobalStyle;
