import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import PropTypes from 'prop-types';
import { EmptyListImage, Screen } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import EmptyStateGraphic from '../assets/images/EmptyStateGraphic.svg';
import { ext } from '../const';
import { selectors } from '../redux';

export class RestrictedScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({
      title: null,
    });
  }

  render() {
    const { userLocation } = this.props;

    const title = userLocation.missingPermissions
      ? I18n.t(ext('missingPermissionsTitle'))
      : I18n.t(ext('emptyStateTitle'));
    const message = userLocation.missingPermissions
      ? I18n.t(ext('missingPermissionsMessage'))
      : I18n.t(ext('emptyStateMessage'));

    return (
      <Screen styleName="paper with-notch-padding">
        <EmptyListImage
          image={EmptyStateGraphic}
          title={title}
          message={message}
        />
      </Screen>
    );
  }
}

RestrictedScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  userLocation: PropTypes.object,
};

RestrictedScreen.defaultProps = {
  userLocation: {},
};

function mapStateToProps(state, ownProps) {
  return {
    userLocation: selectors.getUserCurrentLocation(state),
    ...getRouteParams(ownProps),
  };
}

export default connect(mapStateToProps)(RestrictedScreen);
