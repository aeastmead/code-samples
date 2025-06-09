import { createStore, applyMiddleware, Store, PreloadedState } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk, { ThunkExtraArgument, ThunkMiddleware } from 'redux-thunk';
import { DefaultRootState } from 'react-redux';
import { createEpicMiddleware, EpicMiddleware } from 'redux-observable';
import isNil from 'lodash/isNil';
import rootEpic from './rootEpic';
import rootReducer from './rootReducer';
import { createContainer } from '../api';
import { RootState, DefaultActionUnion } from './types';

export default function configureStore(option: ConfigureStoreOption = {}): Store<RootState, any> {
  const dependencies: ThunkExtraArgument = !isNil(option.dependencies) ? option.dependencies : createContainer();

  const thunkMiddleware: ThunkMiddleware<RootState, any> = thunk.withExtraArgument(dependencies);

  const epicsMiddleware: EpicMiddleware<DefaultActionUnion, DefaultActionUnion, DefaultRootState, ThunkExtraArgument> =
    createEpicMiddleware({ dependencies });

  const middlewares = composeWithDevTools(applyMiddleware(epicsMiddleware, thunkMiddleware));
  const store: Store<RootState, any> = isNil(option.initialState)
    ? createStore(rootReducer, middlewares)
    : createStore(rootReducer, option.initialState, middlewares);

  epicsMiddleware.run(rootEpic);
  return store;
}

export type ConfigureStoreOption = {
  dependencies?: ThunkExtraArgument;
  initialState?: PreloadedState<RootState>;
};
