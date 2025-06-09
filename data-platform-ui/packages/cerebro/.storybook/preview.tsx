import React from 'react';
import { BBUIApp } from '@bbnpm/bb-ui-framework';
import { nlssLightTheme } from '../src';
import GlobalStyle from '../src/GlobalStyle';

function bbUIDecorator(Story) {
  return (
    <BBUIApp themes={[nlssLightTheme]} activeTheme="nlssLightTheme">
      <GlobalStyle /> <Story />
    </BBUIApp>
  );
}

export const decorators = [bbUIDecorator];
