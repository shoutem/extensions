import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import { connect } from 'react-redux';
import { EmptyListImage, Screen } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, HeaderBackButton } from 'shoutem.navigation';
import EmptyStateGraphic from '../assets/images/EmptyStateGraphic.svg';
import { ext } from '../const';
import { selectors } from '../redux';

export class RestrictedScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBind(this);
  }

  componentDidMount() {
    const { navigation, canGoBack } = this.props;

    navigation.setOptions({
      title: null,
      headerLeft: canGoBack
        ? props => <HeaderBackButton {...props} onPress={this.handleCancel} />
        : null,
    });
  }

  handleCancel() {
    const { onCancel } = this.props;

    onCancel();
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

function mapStateToProps(state, ownProps) {
  return {
    userLocation: selectors.getUserCurrentLocation(state),
    ...getRouteParams(ownProps),
  };
}

export default connect(mapStateToProps)(RestrictedScreen);
