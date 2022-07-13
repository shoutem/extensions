import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Screen,
  ScrollView,
  SimpleHtml,
  Text,
  Title,
  View,
} from '@shoutem/ui';
import { consumeNotification } from 'shoutem.firebase';
import { I18n } from 'shoutem.i18n';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { ext, notificationShape } from '../const';
import { formatTimestamp } from '../services';

export class NotificationDetailsScreen extends PureComponent {
  static propTypes = {
    notification: notificationShape.isRequired,
    consumeNotification: PropTypes.func,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({
      ...composeNavigationStyles(['noBorder']),
      title: '',
    });
  }

  handleViewNotification() {
    const { notification, consumeNotification } = this.props;

    const resolvedNotification = _.has(notification, 'action')
      ? { ...notification, ...notification.action }
      : notification;

    consumeNotification(resolvedNotification);
  }

  renderViewNotificationButton() {
    return (
      <Button onPress={this.handleViewNotification} styleName="secondary">
        <Text>{I18n.t(ext('viewNotificationButton'))}</Text>
      </Button>
    );
  }

  renderContent() {
    const { notification, style } = this.props;
    const { action, summary, timestamp, title } = notification;

    return (
      <View styleName="vertical h-center v-start">
        {title ? (
          <Title
            style={style.title}
            styleName="xl-gutter-top lg-gutter-bottom md-gutter-horizontal"
          >
            {title.toUpperCase()}
          </Title>
        ) : null}
        <Caption style={style.timestamp} styleName="xl-gutter-bottom">
          {formatTimestamp(timestamp)}
        </Caption>
        <SimpleHtml baseFontStyle={style.message} body={summary} />
        {action && this.renderViewNotificationButton()}
      </View>
    );
  }

  render() {
    return (
      <Screen styleName="paper">
        <ScrollView>{this.renderContent()}</ScrollView>
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => ({
  notification: getRouteParams(ownProps).notification,
});

export const mapDispatchToProps = { consumeNotification };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('NotificationDetailsScreen'))(NotificationDetailsScreen));
