import 'redux-thunk';

declare module 'redux-thunk' {
  import { DefaultRootState } from 'react-redux';
  import { ThunkAction, ThunkDispatch } from 'redux-thunk';
  import { DefaultActionUnion } from '../store';
  import { DependenciesContainer } from '../api';
  export type ThunkExtraArgument = DependenciesContainer;
  export type ThunkGetState = () => DefaultRootState;
  export type DefaultThunkDispatch = ThunkDispatch<DefaultRootState, ThunkExtraArgument, DefaultActionUnion>;

  export type DefaultThunkAction<R = Promise<any>> = ThunkAction<
    R,
    DefaultRootState,
    ThunkExtraArgument,
    DefaultActionUnion
  >;
}
