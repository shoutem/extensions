import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, View } from '@shoutem/ui';
import { ext } from '../const';

function NavigationToolbar({
  goBack,
  goForward,
  reload,
  reset,
  style,
  webNavigationState,
}) {
  const { canGoBack, canGoForward, url } = webNavigationState;

  const hasNavigated = url !== 'about:blank';

  function navigateBack() {
    if (hasNavigated && !canGoBack) {
      reset();
    }

    goBack();
  }

  function reloadWebView() {
    if (!hasNavigated) {
      reset();
      return;
    }

    reload();
  }

  const isOnInitialSource = !canGoBack && !hasNavigated;
  const backIconStyle = isOnInitialSource ? style.disabledIcon : null;
  const forwardIconStyle = !canGoForward ? style.disabledIcon : null;

  return (
    <View style={style.container}>
      <View style={style.navigationButtons}>
        <Button
          disabled={isOnInitialSource}
          onPress={navigateBack}
          style={style.navigationButton}
        >
          <Icon name="left-arrow" style={backIconStyle} />
        </Button>
        <Button
          disabled={!canGoForward}
          onPress={goForward}
          style={style.navigationButton}
        >
          <Icon name="right-arrow" style={forwardIconStyle} />
        </Button>
      </View>
      <View style={style.refreshButtonContainer}>
        <Button onPress={reloadWebView} style={style.refreshButton}>
          <Icon name="refresh" />
        </Button>
      </View>
    </View>
  );
}

NavigationToolbar.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
  webNavigationState: PropTypes.object.isRequired,
};

export default connectStyle(ext('NavigationToolbar'))(NavigationToolbar);
