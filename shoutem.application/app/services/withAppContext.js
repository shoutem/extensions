import React from 'react';
import PropTypes from 'prop-types';
import { AppContextProvider } from 'shoutem-core';
import { View } from '@shoutem/ui';

export function withAppContext(WrappedComponent) {
  const ResultComponent = props => {
    return (
      <AppContextProvider>
        {context => (
          <View styleName="flexible">
            {context.renderContentHeader}
            <WrappedComponent {...props} />
            {context.renderContentFooter}
          </View>
        )}
      </AppContextProvider>
    );
  };

  ResultComponent.propTypes = { route: PropTypes.object };

  return ResultComponent;
}
