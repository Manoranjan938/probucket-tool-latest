import {
  applyMiddleware,
  compose,
  createStore,
  type Store,
  type StoreEnhancer,
} from "redux";
import { thunk, type ThunkDispatch } from "redux-thunk";
import rootReducer from "./rootReducer";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => StoreEnhancer;
  }
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppAction = Parameters<typeof rootReducer>[1];
export type AppDispatch = ThunkDispatch<RootState, unknown, AppAction>;

const initialState = {};
const middleware = [thunk];

let store: Store<RootState, AppAction> & { dispatch: AppDispatch };

let ReactReduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

if (window.navigator.userAgent.includes("Chrome") && ReactReduxDevTools) {
  store = createStore(
    rootReducer,
    initialState,
    // compose() can't infer the combined type of two enhancers
    compose(
      applyMiddleware(...middleware),
      ReactReduxDevTools
    ) as StoreEnhancer<{ dispatch: AppDispatch }>
  );
} else {
  store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware))
  );
}

export default store;
