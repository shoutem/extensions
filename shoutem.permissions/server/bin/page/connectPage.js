import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getShortcut, getExtension } from '@shoutem/redux-api-sdk';

export function connectPageContext(WrappedComponent) {
  function PageProvider(props, context) {
    const { page } = context;
    const pageProps = _.pick(page.getPageContext(), [
      'appId',
      'appOwnerId',
      'extensionName',
      'ownExtensionName',
      'shortcutId',
      'screenId',
    ]);

    const parameters = page.getParameters();

    return <WrappedComponent {...pageProps} parameters={parameters} />;
  }

  PageProvider.contextTypes = {
    page: PropTypes.object,
  };

  return PageProvider;
}

function mapStateToProps(state, ownProps) {
  const { shortcutId, extensionName, ownExtensionName } = ownProps;

  return {
    shortcut: getShortcut(state, shortcutId),
    extension: getExtension(state, extensionName),
    ownExtension: getExtension(state, ownExtensionName),
  };
}

export default function connectPage() {
  return wrappedComponent =>
    connectPageContext(connect(mapStateToProps)(wrappedComponent));
}
