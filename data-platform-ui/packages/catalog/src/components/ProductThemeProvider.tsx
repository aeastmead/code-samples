import React from 'react';
import { ThemeProvider } from 'styled-components';
import type { DefaultTheme } from 'styled-components';
import { DatasetTheme, ResourceTheme } from '../theme';

export default function ProductThemeProvider({ resource, children }: Props): React.ReactElement {
  const theme: DefaultTheme = React.useMemo(()=> resource === true ? ResourceTheme : DatasetTheme, [resource])
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

ProductThemeProvider.displayName = ' NLSSProductThemeProvider';

type Props = IProductThemeProviderProps;
export interface IProductThemeProviderProps {
  children?: React.ReactNode;
  resource?: boolean;
}
