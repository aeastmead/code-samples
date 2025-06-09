import React from 'react';
import { DefaultRootState, useSelector } from 'react-redux';
import { ParametricSelector } from 'reselect';


export function useSelectorFactory<
  P,
  R,
  TSelector extends ParametricSelector<DefaultRootState, P, R> = ParametricSelector<DefaultRootState, P, R>
>(makeSelectorFactory: () => TSelector, props: P): R {
  const madeSelector: TSelector = React.useMemo(makeSelectorFactory, []);

  return useSelector<DefaultRootState, R>((state: DefaultRootState) => madeSelector(state, props));
}
