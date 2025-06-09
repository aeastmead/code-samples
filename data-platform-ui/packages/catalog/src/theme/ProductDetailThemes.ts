import type { DefaultTheme } from 'styled-components';
import cloneDeep from 'lodash/cloneDeep';
import NLSSTheme from './NLSSTheme';

function createProductDetailTheme(name: string, productColors: ProductColorStyles): DefaultTheme {
  const baseTheme: DefaultTheme = cloneDeep(NLSSTheme);
  baseTheme.name = `nlss${name}Light`;
  baseTheme.tabs.colors.border = productColors.color;
  baseTheme.titleBanner.colors.background = productColors.color;
  baseTheme.titleBanner.colors.text = productColors.textColor;

  return baseTheme;
}

export const DatasetTheme: DefaultTheme = createProductDetailTheme('Dataset', {
  color: NLSSTheme.datasetColor,
  textColor: '#FFFFFF'
});

export const ResourceTheme: DefaultTheme = createProductDetailTheme('Resource', {
  color: NLSSTheme.resourceColor,
  textColor: '#000000'
});

type ProductColorStyles = {
  color: string;
  textColor: string;
};
