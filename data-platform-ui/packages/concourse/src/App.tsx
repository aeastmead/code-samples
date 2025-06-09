import React from 'react';
import { NLSSApp } from '@nlss/cerebro';
import { Provider } from 'react-redux';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Search from './Search';
import createStore from './store';

const store = createStore();

export interface AppProps extends NLSSApp.Props {}

export default function App(props: AppProps): React.ReactElement {
  return (
    <Provider store={store}>
      <BrowserRouter window={window}>
        <Routes>
          <Route
            element={
              <NLSSApp {...props} searchResultApp>
                <Outlet />
              </NLSSApp>
            }>
            <Route index element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/catalog" element={<Search />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
