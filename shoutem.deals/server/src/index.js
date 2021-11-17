import { shoutemUrls } from '@shoutem/cms-dashboard';
import { types } from './services';
import reducer from './redux';
import './style.scss';

// export everything from extension.js
export * from './extension';

// eslint-disable-next-line import/no-mutable-exports
let pageReducer = null;

export function pageWillMount(page) {
  shoutemUrls.init(page);
  types.init(page);

  pageReducer = reducer(page);
}

export { pageReducer as reducer };
