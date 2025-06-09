import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { configureStore, initialAction } from './store';
import { appBootstrap, NLSSUser } from '@nlss/brain-trust';

appBootstrap().then((user: NLSSUser | undefined) => {
  if (user === undefined) {
    return;
  }
  const store = configureStore();

  store.dispatch<Promise<void>>(initialAction).then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <Router basename={ROUTER_BASE_PATH}>
          <App userName={user.firstName} />
        </Router>
      </Provider>,
      document.getElementById('root')
    );
  });
});
