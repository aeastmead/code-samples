import '@bbnpm/bb-ui-framework';
import 'styled-components';
import { NLSSTheme } from '@nlss/cerebro';
import { DefaultActionUnion, DefaultRootState } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { ConcourseActionUnion, ConcourseRootAPI, ConcourseRootState } from './store';

declare module '@bbnpm/bb-ui-framework' {
  export interface ConsumerTheme extends NLSSTheme {}
}

declare module 'styled-components' {
  export interface DefaultTheme extends NLSSTheme {}
}

declare module 'react-redux' {
  export interface DefaultRootState extends ConcourseRootState {}
  export type DefaultActionUnion = ConcourseActionUnion;
}

declare module 'redux-thunk' {
  export type ThunkExtraArgs = ConcourseRootAPI;

  export type DefaultThunkDispatch = ThunkDispatch<DefaultRootState, ThunkExtraArgs, DefaultActionUnion>;

  export type DefaultThunkAction<ReturnType> = ThunkAction<
    ReturnType,
    DefaultRootState,
    ThunkExtraArgs,
    DefaultActionUnion
  >;
}

declare module 'redux' {
  /*
   * Overload to add thunk support to Redux's dispatch() function.
   * Useful for react-redux or any other library which could use this type.
   */
  export interface Dispatch<A extends Action = AnyAction> {
    <TReturnType = any, TState = any, TExtraThunkArg = any>(
      thunkAction: ThunkAction<TReturnType, TState, TExtraThunkArg, A>
    ): TReturnType;
  }
}
