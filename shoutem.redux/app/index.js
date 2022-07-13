import React from 'react';
import { before, priorities, setPriority } from 'shoutem-core';
import { preventStateRehydration } from './services/state';
import { createStore } from './services/store';
import { StoreProvider } from './providers';

let store = null;

export const appWillMount = setPriority(app => {
  store = createStore(app);
  app.setStore(store);
  return Promise.resolve();
}, before(priorities.INIT));

export const renderProvider = setPriority(children => {
  return <StoreProvider store={store}>{children}</StoreProvider>;
}, priorities.REDUX);

export function getStore() {
  return store;
}

export { preventStateRehydration };
