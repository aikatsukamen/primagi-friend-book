import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer, { RootState } from '../reducers';
import rootSaga from '../sagas';
import { initial } from '../reducers/notify';
import { initial as contentInitial } from '../reducers/content';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  // const store = createStore(reducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const stateStr = localStorage.getItem('reduxState_conntent');
  const persistedState = stateStr
    ? (() => {
        const stateJson: RootState['content'] = JSON.parse(stateStr);
        // 型を変えたので旧版のstateを無理やり上書きする
        if (!Array.isArray(stateJson.favList)) {
          stateJson.favList = [];
        }
        return {
          notify: initial as any,
          content: {
            ...contentInitial,
            ...stateJson,
          },
        };
      })()
    : {};

  const store = createStore(reducer, persistedState, composeEnhancers(applyMiddleware(sagaMiddleware)));
  // 変更があったときに保存する
  store.subscribe(() => {
    localStorage.setItem('reduxState_conntent', JSON.stringify(store.getState().content));
  });

  if ((module as any).hot) {
    // Enable Webpack hot module replacement for reducers
    (module as any).hot.accept('../reducers', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  sagaMiddleware.run(rootSaga);
  return store;
}
