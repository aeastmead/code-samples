import { Connect as OriginalConnect } from 'react-redux';
import { RootState } from '../store';

declare module 'react-redux' {
  export interface DefaultRootState extends RootState {}

  /*
  @TODO: update typing components
   */
  export type MapStateToProps<TStateProps, TOwnProps, State = DefaultRootState> = (
    state: State,
    ownProps: TOwnProps
  ) => TStateProps;

  export declare type MapStateToPropsFactory<TStateProps, TOwnProps, State = DefaultRootState> = (
    initialState: State,
    ownProps: TOwnProps
  ) => MapStateToProps<TStateProps, TOwnProps, State>;

  export declare const useSelector: <TState = DefaultRootState, Selected = unknown>(
    selector: (state: TState) => Selected,
    equalityFn?: EqualityFn<Selected> | undefined
  ) => Selected;

  export interface Connect extends OriginalConnect<DefaultRootState> {}
}
