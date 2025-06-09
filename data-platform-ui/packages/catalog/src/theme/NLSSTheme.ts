import { DarkTheme, LightTheme, Theme, ThemeBase } from '@bbnpm/bb-ui-framework';
import cloneDeep from 'lodash/cloneDeep';

const baseTheme: Theme = cloneDeep(LightTheme);

const backgroundColor: string = baseTheme.colors.background;
const shadow: string = baseTheme.shadows.default;

const fontSize: INLSSTheme['fontSizes'] = {
  xsmall: '0.625rem', // 10px
  small: '0.75rem', // 12px
  base: '0.875rem', // 14px
  medium: '1rem', // 16px
  large: '1.125rem', // 18px
  xlarge: '1.5rem', // 24px
  xxlarge: '1.75rem', // 28px
  xxxlarge: '2.375rem' // 38px
};

const subHeaderFontSize = fontSize.medium;

const NLSSTheme: INLSSTheme = {
  ...baseTheme,
  name: 'nlssLight',
  links: {
    colors: {
      default: ThemeBase.palette.BLUE[600],
      hover: ThemeBase.palette.BLUE[400],
      visited: ThemeBase.palette.BLUE[600]
    }
  },
  tabs: {
    colors: {
      ...baseTheme.tabs.colors,
      paneBackground: backgroundColor,
      disabled: backgroundColor,
      background: backgroundColor,
      hover: ThemeBase.palette.GREY[100]
    },
    paneShadow: shadow
  },
  font: {
    ...baseTheme.font,
    headline: fontSize.xxlarge,
    title: fontSize.xlarge,
    rootFontSize: '16px',
    size: fontSize,
    subheader: '1rem',
    weight: baseTheme.font.weight,
    fontFamily: `'AvenirNextP2ForBBG', Arial, Helvetica, sans-serif`
  },
  layout: {
    gridSideOffset: '32px',
    gridSideOffsetPx: 32,
    gutterWidth: '1rem',
    spacingFactorREM: 1,
    footerBackgroundColor: DarkTheme.colors.background,
    footerFontColor: DarkTheme.colors.text
  },
  titleBanner: {
    shadow,
    height: '2rem',
    fontSize: subHeaderFontSize,
    fontWeight: 500,
    iconSize: subHeaderFontSize,
    colors: {
      background: backgroundColor,
      text: baseTheme.colors.text
    }
  },

  productDetail: {
    sidePadding: '2rem',
    topPadding: '1rem'
  },
  health: {
    good: ThemeBase.palette.GREEN[200],
    ok: ThemeBase.palette.YELLOW[200],
    bad: ThemeBase.palette.RED[100]
  },
  resourceColor: '#FFB04c',
  datasetColor: '#4EA69F',
  spacingSizes: {
    xsmall: '.25rem', // 4px
    small: '.5rem', // 8px
    medium: '1rem', //16px
    large: '2rem', // 32px
    xlarge: '4rem', // 64px
    xxlarge: '8rem'
  },
  fontSizes: {
    ...fontSize
  },
  fontWeights: {
    ...baseTheme.font.weight
  }
};

export default NLSSTheme;

export interface INLSSTheme extends Omit<Theme, 'font' | 'tabs'> {
  productDetail: ProductDetailStyles;
  links: LinkStyles;
  font: {
    fontFamily: string;
    rootFontSize: string;
    size: {
      xsmall: string;
      small: string;
      base: string;
      medium: string;
      large: string;
      xlarge: string;
      xxlarge: string;
      xxxlarge: string;
    };
    weight: {
      heavy: number;
      bold: number;
      demi: number;
      medium: number;
      normal: number;
      light: number;
      thin: number;
    };
    lineHeights: {
      lineHeight: string;
    };
    headline: string;
    subheader: string;
    title: string;
  };
  tabs: TabsStyle;
  titleBanner: {
    colors: {
      text: string;
      background: string;
    };
    height: string;
    shadow: string;
    fontSize: string;
    fontWeight: number;
    iconSize: string;
  };
  resourceColor: string;
  datasetColor: string;
  layout: {
    /**
     * Page padding
     */
    gridSideOffset: string;

    gridSideOffsetPx: number;

    /**
     * Padding offsets
     */
    gutterWidth: string;

    spacingFactorREM: number;

    footerBackgroundColor: string;
    footerFontColor: string;
  };
  health: {
    good: string;
    ok: string;
    bad: string;
  };
  spacingSizes: {
    xsmall: string;
    small: string;
    medium: string;
    large: string;
    xlarge: string;
    xxlarge: string;
  };
  fontSizes: {
    xsmall: string;
    small: string;
    base: string;
    medium: string;
    large: string;
    xlarge: string;
    xxlarge: string;
    xxxlarge: string;
  };
  fontWeights: {
    thin: number;
    light: number;
    normal: number;
    medium: number;
    demi: number;
    bold: number;
    heavy: number;
  };
}

export interface ProductDetailStyles {
  sidePadding: string;
  topPadding: string;
}
interface LinkStyles {
  colors: {
    default: string;
    hover: string;
    visited: string;
  };
}

interface TabsStyle {
  paneShadow: string;
  colors: {
    background: string;
    border: string;
    disabled: string;
    hover: string;
    active: string;
    paneBackground: string;
  };
}
