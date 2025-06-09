import { createTheme, lightTheme, Theme, ThemeConfig } from '@bbnpm/bb-ui-framework';
import { AppModuleConfig, appModuleConfigArray, AppModuleName } from '@nlss/brain-trust';

const spacingSizes: NLSSThemeAdditions['spacingSizes'] = {
  xsmall: '.25rem', // 4px
  small: '.5rem', // 8px
  medium: '1rem', //16px
  large: '2rem', // 32px
  xlarge: '4rem', // 64px
  xxlarge: '8rem'
};

const fontSizes: Theme['fontSizes'] = {
  xsmall: '0.625rem', // 10px
  small: '0.75rem', // 12px
  base: '0.875rem', // 14px
  medium: '1rem', // 16px
  large: '1.125rem', // 18px
  xlarge: '1.5rem', // 24px
  xxlarge: '1.75rem', // 28px
  xxxlarge: '2.375rem' // 38px
};

export const nlssLightTheme: ThemeConfig<NLSSThemeAdditions & Theme> = createTheme<Theme, NLSSThemeAdditions>(
  lightTheme as any,
  {
    name: 'nlssLightTheme',
    spacingSizes,
    rootFontSize: '16px',
    fontSizes,
    subAppColors: appModuleConfigArray.reduce<ThemeConfig<Theme, NLSSThemeAdditions['subAppColors']>>(
      (accum: ThemeConfig<Theme, NLSSThemeAdditions['subAppColors']>, mod: AppModuleConfig) => {
        accum[mod.kind] = mod.iconColorFromTheme;
        return accum;
      },
      {} as any
    )
  }
);

export interface NLSSThemeAdditions {
  spacingSizes: {
    xsmall: string;
    small: string;
    medium: string;
    large: string;
    xlarge: string;
    xxlarge: string;
  };
  rootFontSize: string;
  subAppColors: { [K in AppModuleName]: string };
}

export interface NLSSTheme extends NLSSThemeAdditions, Theme {}
