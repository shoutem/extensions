import React from 'react';
import { priorities, setPriority } from 'shoutem-core';
import { StoreProvider } from './providers';
import { createStore } from './services/store';
import { preventStateRehydration } from './services/state';

let store = null;

export const appWillMount = setPriority(app => {
  store = createStore(app);
  app.setStore(store);
}, priorities.INIT);

export function renderProvider(children) {
  return (
    <StoreProvider store={store}>
      {children}
    </StoreProvider>
  );
};

export function getStore() {
  return store;
}

export {
  preventStateRehydration,
};
