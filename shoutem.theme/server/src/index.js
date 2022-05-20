import './style.scss';
import { shoutemUrls, pageParameters } from './services';

export * from './extension';

export function pageWillMount(page) {
  shoutemUrls.init(page);
  pageParameters.init(page);
}

export { reducer } from './redux';
