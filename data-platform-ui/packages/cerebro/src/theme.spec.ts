import { nlssLightTheme, NLSSTheme } from './theme';
import { makeThemeFromConfig } from '@bbnpm/bb-ui-framework/ThemeProvider/ThemeProvider';

describe('NLSSTheme', () => {
  const theme: NLSSTheme = makeThemeFromConfig(nlssLightTheme);

  it('should configure domainColors', () => {
    const valueExpected = expect.stringMatching(/rem$/);

    expect(theme.spacingSizes).toMatchObject({
      xsmall: valueExpected,
      small: valueExpected,
      medium: valueExpected,
      large: valueExpected,
      xlarge: valueExpected,
      xxlarge: valueExpected
    });
  });
});
