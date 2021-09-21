import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withIsFocused, FocusTriggerBase } from 'shoutem.navigation';
import { triggerScreenView } from '../redux';

export function withScreenTracking(WrappedComponent) {
  class ScreenTracker extends FocusTriggerBase {
    static propTypes = {
      ...FocusTriggerBase.propTypes,
      route: PropTypes.object,
      triggerScreenView: PropTypes.func,
    };

    handleFocus() {
      const { route, triggerScreenView } = this.props;
      const shortcutTitle = _.get(route, 'params.shortcut.title');
      const screenName = _.get(route, 'name');
      const resolvedRouteName = shortcutTitle || screenName;

      triggerScreenView(resolvedRouteName);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapDispatchToProps = {
    triggerScreenView,
  };

  const resolvedMapStateToProps = FocusTriggerBase.createMapStateToProps();

  const ResultComponent = connect(
    resolvedMapStateToProps,
    mapDispatchToProps,
  )(ScreenTracker);

  return withIsFocused(ResultComponent);
}
