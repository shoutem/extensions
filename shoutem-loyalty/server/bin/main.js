import '@shoutem/react-web-ui/lib/styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import _ from 'lodash';
import URI from 'urijs';
import api from '@shoutem/api';
import { LoaderContainer } from '@shoutem/react-web-ui';
import * as extension from '../src/index';
import { PageProvider, connectPage } from './pageProvider';
import configureStore from './configureStore';
import Page from './page';

const uri = new URI(window.location.href);
const pageName = _.get(uri.search(true), 'page', '');
const PageComponent = _.get(extension, ['pages', pageName]);

function renderPage() {
  if (!PageComponent) {
    return (
      <div>Page not found: {pageName}</div>
    );
  }

  const ConnectedPageComponent = connectPage()(PageComponent);
  return (<ConnectedPageComponent />);
}

// handler for Shoutem initialization finished
function onShoutemReady(event) {
  // config object containing builder extension configuration, can be accessed via event
  // or by shoutem.sandbox.config
  const config = event.detail.config;
  const { context, parameters } = config;

  const page = new Page(context, parameters);

  const apiContext = _.omit(context, ['extensionInstallationId', 'shortcutId', 'screenId']);
  api.init(apiContext);

  const pageWillMount = _.get(extension, 'pageWillMount');
  if (pageWillMount) {
    pageWillMount(page);
  }

  const store = configureStore(context);

  // Render it to DOM
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  ReactDOM.render(
    <Provider store={store}>
      <PageProvider page={page}>
        {renderPage()}
      </PageProvider>
    </Provider>,
    document.getElementById('root')
  );
}

// listen for Shoutem initialization complete
document.addEventListener('shoutemready', onShoutemReady, false);

// Render it to DOM
ReactDOM.render(
  <LoaderContainer size="50px" isLoading />,
  document.getElementById('root')
);


