import {render} from 'react-dom';
import React from 'react';
import {syncHistory, routeReducer} from 'redux-simple-router'
import {Map, fromJS} from 'immutable';
import {ensureState} from 'redux-optimistic-ui';

const makeStore = __PRODUCTION__ ? require('./makeStore.dev.js') : require('./makeStore.dev.js');
const Root = __PRODUCTION__ ? require('./Root.dev.js') : require('./Root.dev.js');
const {auth, routing, form} = window.__INITIAL_STATE__;

// Currently, 3rd party reducers are kept at plain JS objects (routing and form)
let initialState = Map([
  ['auth', fromJS(auth)],
  ['routing', routing],
  ['form', form]
]);

const store = makeStore(initialState);
render(<Root store={store}/>, document.getElementById('root'));

// Will implement when react-router supports HMR
//if (module.hot) {
//  module.hot.accept('../universal/redux/makeReducer', () => {
//    const nextRootReducer = require('../universal/redux/makeReducer')
//    store.replaceReducer(nextRootReducer())
//  })
//  //module.hot.dispose(data => data.foo = 'hi');
//}

