import { compose, createStore, applyMiddleware, combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import configureOauth2, { reducer as oauthReducer } from 'react-redux-oauth2'
import { reducer as notifications } from 'react-notification-system-redux'
import { nprogress } from 'redux-nprogress'
import middlewares from './middlewares'
import { reducer } from './reduxers'
import config from './config'

export function configure (reducers, initial) {
  const store = createStore(reducers, initial,
    compose(
    applyMiddleware.apply(this, middlewares),
    (!process.env.__SERVER__ && window.devToolsExtension) ? window.devToolsExtension() : f => f
  ))

  return store
}
export default function (history) {
  configureOauth2(config.oauth)

  return configure(combineReducers({
    ...reducer,
    ...oauthReducer,
    nprogress,
    notifications,
    reduxAsyncConnect,
    routing: routerReducer,
    form: formReducer
  }), !process.env.__SERVER__ ? window.__INITIAL_STATE__ : {}, history)
}
