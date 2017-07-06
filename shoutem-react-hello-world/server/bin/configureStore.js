import '@shoutem/react-web-ui/lib/styles/index.scss';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import { apiStateMiddleware, enableRio } from '@shoutem/redux-io';
import _ from 'lodash';
import * as extension from '../src/index';
import { createRootReducer } from './reducers';

export default function configureStore(context) {
  const middlewareList = [
    thunk,
    apiMiddleware,
    apiStateMiddleware,
  ];
  const middleware = compose(applyMiddleware(...middlewareList));

  const extensionName = context.extensionName;
  const reducer = _.get(extension, 'reducer');
  const rootReducer = createRootReducer(extensionName, reducer);
  const store = middleware(createStore)(enableRio(rootReducer));

  return store;
}
