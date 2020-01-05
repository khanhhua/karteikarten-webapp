import { createStore, applyMiddleware } from 'redux';
import { compose } from "redux";
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';

import appHistory from './appHistory';
import rootReducer from './reducers';
import rootSaga from "./sagas";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ shouldHotReload: false }) || compose;

const sagaMiddleware = createSagaMiddleware();
const routerMW = routerMiddleware(appHistory);

export default function configureStore() {
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(sagaMiddleware, routerMW))
  );

  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      console.log('Hot reloading reducers...');
    });
  }

  return store;
}
