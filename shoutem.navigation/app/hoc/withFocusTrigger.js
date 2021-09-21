import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { useIsFocused } from '@react-navigation/native';
import { getNavInitialized } from '../redux';

export class FocusTriggerBase extends PureComponent {
  static propTypes = {
    navigationReady: PropTypes.bool,
    navigation: PropTypes.object,
    isFocused: PropTypes.bool,
  };

  static createMapStateToProps = mapStateToProps => {
    return state => ({
      navigationReady: getNavInitialized(state),
      ...(mapStateToProps && mapStateToProps(state)),
    });
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    const { navigation, navigationReady } = this.props;

    if (navigationReady) {
      this.unsubscribe = navigation.addListener('focus', this.handleFocus);
    }
  }

  componentDidUpdate(prevProps) {
    const { navigationReady, navigation, isFocused } = this.props;
    const { navigationReady: prevNavigationReady } = prevProps;

    if (navigationReady && !prevNavigationReady) {
      if (!this.unsubscribe) {
        this.unsubscribe = navigation.addListener('focus', this.handleFocus);
      }

      if (isFocused) {
        this.handleFocus();
      }
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleFocus() {}
}

export function withIsFocused(WrappedComponent) {
  return props => {
    const isFocused = useIsFocused();

    return <WrappedComponent {...props} isFocused={isFocused} />;
  };
}
