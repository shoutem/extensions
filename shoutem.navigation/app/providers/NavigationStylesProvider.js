import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getAppStyle } from 'shoutem.theme';
import { createNavigatonStyles } from '../services';

export const NavigationStylesContext = React.createContext();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class NavigationStylesProvider extends PureComponent {
  render() {
    const { children, appStyle, animationDriver, navBarSettings } = this.props;

    if (_.isEmpty(appStyle)) {
      return null;
    }

    const navigationStyles = createNavigatonStyles({
      theme: appStyle,
      animationDriver,
      navBarSettings,
    });

    return (
      <NavigationStylesContext.Provider value={navigationStyles}>
        <View style={styles.container}>{children}</View>
      </NavigationStylesContext.Provider>
    );
  }
}

NavigationStylesProvider.propTypes = {
  animationDriver: PropTypes.any.isRequired,
  navBarSettings: PropTypes.object.isRequired,
  appStyle: PropTypes.object,
  children: PropTypes.any,
};

NavigationStylesProvider.defaultProps = {
  appStyle: {},
  children: [],
};

const mapStateToProps = state => ({
  appStyle: getAppStyle(state),
});

export default connect(mapStateToProps, null)(NavigationStylesProvider);
