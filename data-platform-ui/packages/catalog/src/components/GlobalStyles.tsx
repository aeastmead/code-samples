import React from 'react';
import { createGlobalStyle, DefaultTheme, GlobalStyleComponent, ThemeProps } from 'styled-components';

import { GlobalStyles as BBUIGlobalStyles } from '@bbnpm/bb-ui-framework';

const NLSSGlobalStyles: GlobalStyleComponent<Record<string, any>, DefaultTheme> = createGlobalStyle<
  ThemeProps<DefaultTheme>
>`

  html, body, #root {
    margin: 0;
    padding: 0;
  }
  html {
    font-size: ${({ theme }) => theme.font.rootFontSize}
  }
 
  body {
    font-family: ${({ theme }) => theme.font.fontFamily};
    font-size: ${({ theme }) => theme.font.size.base};
    height: 100vh;
    width: 100vw;
  }
  
  pre, div, span, button, a, td, th {
    font-family: inherit;
  }
  
  #root {
    height: 100vh;
    width: 100vw;
    overflow-x: hidden;
    overflow-y: visible;
  }
  

  
  .nlss-text {
    &--truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    &--hard-wrap {
      overflow-wrap: break-word;
    }
    
  }


  /* AvenirNextP2ForBBG-Heavy*/
  @font-face {
    font-family: 'AvenirNextP2ForBBG';
    font-display: fallback;
    font-weight: 900;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Heavy-5b0822db83.woff2')
    format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Heavy-3b108864bd.woff') format('woff');
  }

  /* AvenirNextP2ForBBG-HeavyItalic */
  @font-face {
    font-family: 'AvenirNextP2ForBBG';
    font-display: fallback;
    font-weight: 900;
    font-style: italic;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-HeavyItalic-38cab08278.woff2')
    format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-HeavyItalic-ad5430020f.woff')
    format('woff');
  }

  /* AvenirNextP2ForBBG-Bold */
  @font-face {
    font-family: 'AvenirNextP2ForBBG';
    font-display: fallback;
    font-weight: 700;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Bold-848b534204.woff2') format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Bold-845494278e.woff') format('woff');
  }

  /* AvenirNextP2ForBBG-BoldItalic */
  @font-face {
    font-family: 'AvenirNextP2ForBBG';
    font-display: fallback;
    font-weight: 700;
    font-style: italic;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-BoldItalic-f577e39577.woff2')
    format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-BoldItalic-860a65428e.woff')
    format('woff');
  }

  /* AvenirNextP2ForBBG-Demi */
  @font-face {
    font-family: 'AvenirNextP2ForBBG';
    font-display: fallback;
    font-weight: 600;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Demi-d3cb04a057.woff2') format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Demi-f362a7c4ad.woff') format('woff');
  }

  /* AvenirNextP2ForBBG-DemiItalic */
  @font-face {
    font-family: 'AvenirNextP2ForBBG';
    font-display: fallback;
    font-weight: 600;
    font-style: italic;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-DemiItalic-ce112bb955.woff2')
    format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-DemiItalic-166b289109.woff')
    format('woff');
  }

  /* AvenirNextP2ForBBG-Medium */
  @font-face {
    font-family: 'AvenirNextP2ForBBG';
    font-display: fallback;
    font-weight: 500;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Medium-dc5d08072d.woff2')
    format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Medium-72dcf6a6c2.woff') format('woff');
  }

  /* AvenirNextP2ForBBG-MediumItalic */
  @font-face {
    font-family: 'AvenirNextP2ForBBG';
    font-display: fallback;
    font-weight: 500;
    font-style: italic;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-MediumItalic-8a13467cd3.woff2')
    format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-MediumItalic-71db2048c8.woff')
    format('woff');
  }

  /* AvenirNextP2ForBBG-Regular */
  @font-face {
    font-family: 'AvenirNextP2ForBBG';
    font-display: fallback;
    font-weight: 400;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Regular-517a851989.woff2')
    format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Regular-80b65cbe3a.woff') format('woff');
  }

  /* AvenirNextP2ForBBG-Italic */
  @font-face {
    font-family: 'AvenirNextP2ForBBG';
    font-display: fallback;
    font-weight: 400;
    font-style: italic;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Italic-7107f3ab96.woff2')
    format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Italic-226936a4cb.woff') format('woff');
  }

  /* AvenirNextP2ForBBG-Light */
  @font-face {
    font-family: 'AvenirNextP2ForBBG';
    font-display: fallback;
    font-weight: 300;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Light-5175406f53.woff2')
    format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Light-ba85d34cc2.woff') format('woff');
  }

  /* AvenirNextP2ForBBG-LightItalic */
  @font-face {
    font-family: 'AvenirNextP2ForBBG';
    font-display: fallback;
    font-weight: 300;
    font-style: italic;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-LightItalic-f57090c0e2.woff2')
    format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-LightItalic-fe355e220d.woff')
    format('woff');
  }

  /* AvenirNextP2ForBBG-Thin */
  @font-face {
    font-family: 'AvenirNextP2ForBBG';
    font-display: fallback;
    font-weight: 100;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Thin-a559885f35.woff2') format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-Thin-2f48f00020.woff') format('woff');
  }

  /* AvenirNextP2ForBBG-ThinItalic */
  @font-face {
    font-family: 'AvenirNextP2ForBBG';
    font-display: fallback;
    font-weight: 100;
    font-style: italic;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-ThinItalic-b8376f71a8.woff2')
    format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-ThinItalic-3792ff2042.woff')
    format('woff');
  }

  /* Roboto Monospace Font for Code Blocks and Inline Code */
  /* RobotoMono-Bold */
  @font-face {
    font-family: 'RobotoMono';
    font-display: fallback;
    font-weight: 700;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-BoldItalic-b8868a8a86.woff2') format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-BoldItalic-c363eb5209.woff') format('woff');
  }

  /* RobotoMono-BoldItalic */
  @font-face {
    font-family: 'RobotoMono';
    font-display: fallback;
    font-weight: 700;
    font-style: italic;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-BoldItalic-f577e39577.woff2')
    format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/AvenirNextP2ForBBG-BoldItalic-860a65428e.woff')
    format('woff');
  }

  /* RobotoMono-Medium */
  @font-face {
    font-family: 'RobotoMono';
    font-display: fallback;
    font-weight: 500;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-Medium-f2563bb64f.woff2') format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-Medium-210d82da68.woff') format('woff');
  }

  /* RobotoMono-MediumItalic */
  @font-face {
    font-family: 'RobotoMono';
    font-display: fallback;
    font-weight: 500;
    font-style: italic;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-MediumItalic-f543e48a0d.woff2') format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-MediumItalic-3ffa114322.woff') format('woff');
  }

  /* RobotoMono-Regular */
  @font-face {
    font-family: 'RobotoMono';
    font-display: fallback;
    font-weight: 400;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-Regular-9b83813218.woff2') format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-Regular-62db283fd7.woff') format('woff');
  }

  /* RobotoMono-Italic */
  @font-face {
    font-family: 'RobotoMono';
    font-display: fallback;
    font-weight: 400;
    font-style: italic;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-Italic-231d18af59.woff2') format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-Italic-ada1a06cff.woff') format('woff');
  }

  /* RobotoMono-Light */
  @font-face {
    font-family: 'RobotoMono';
    font-display: fallback;
    font-weight: 300;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-Light-e5e77c869b.woff2') format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-Light-7b9d8444f2.woff') format('woff');
  }

  /* RobotoMono-LightItalic */
  @font-face {
    font-family: 'RobotoMono';
    font-display: fallback;
    font-weight: 300;
    font-style: italic;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-LightItalic-3def77df5a.woff2') format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-LightItalic-286a84c78c.woff') format('woff');
  }

  /* RobotoMono-Thin */
  @font-face {
    font-family: 'RobotoMono';
    font-display: fallback;
    font-weight: 100;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-Thin-e15b1b8579.woff2') format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-Thin-845ca1f2eb.woff') format('woff');
  }

  /* RobotoMono-ThinItalic */
  @font-face {
    font-family: 'RobotoMono';
    font-display: fallback;
    font-weight: 100;
    font-style: italic;
    src: url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-ThinItalic-5f877bbef7.woff2') format('woff2'),
    url('https://assets.bwbx.io/s3/fontservice/fonts/RobotoMono-ThinItalic-c7f0e5e612.woff') format('woff');
  }


  .nlss-grid {
    width: 100%;
    min-height: 100%;
    display: grid;

    grid-template-columns: repeat(12, 1fr);
    grid-column-gap: 2rem;
    grid-auto-rows: max-content;
    grid-row-gap: 1rem;
    grid-auto-flow: row dense;
    &--1 {
      grid-column: span 1;
    }

    &--2 {
      grid-column: span 2;
    }

    &--3 {
      grid-column: span 3;
    }

    &--4 {
      grid-column: span 4;
    }

    &--5 {
      grid-column: span 5;
    }

    &--6 {
      grid-column: span 6;
    }

    &--7 {
      grid-column: span 7;
    }

    &--8 {
      grid-column: span 8;
    }

    &--9 {
      grid-column: span 9;
    }

    &--10 {
      grid-column: span 10;
    }

    &--11 {
      grid-column: span 11;
    }

    &--12 {
      grid-column: span 12;
    }
  }

  .nlss-text-wrap {
    overflow-wrap: normal;

    &--break-word {
      overflow-wrap: anywhere;
    }
  }
  
`;

function GlobalStyles(): React.ReactElement {
  return (
    <>
      <BBUIGlobalStyles />
      <NLSSGlobalStyles />
    </>
  );
}

GlobalStyles.displayName = 'NLSSGlobalStyles';

export default GlobalStyles;
