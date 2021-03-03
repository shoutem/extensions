import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import {
  ScrollView,
  Screen,
  Title,
  Caption,
  SimpleHtml,
  View,
  Button,
  Text,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { I18n } from 'shoutem.i18n';
import { NavigationBar } from 'shoutem.navigation';

import { formatTimestamp } from '../shared/calendar';
import { notificationShape } from '../components/shapes';
import { ext } from '../const';

export class NotificationDetailsScreen extends PureComponent {
  static propTypes = {
    notification: notificationShape.isRequired,
    viewNotification: PropTypes.func.isRequired,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBind(this);
  }

  handleViewNotification() {
    const { notification, viewNotification } = this.props;

    viewNotification(notification);
  }

  renderViewNotificationButton() {
    return (
      <Button
        onPress={this.handleViewNotification}
        styleName="secondary"
      >
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
        <NavigationBar styleName="no-border" />
        <ScrollView>
          {this.renderContent()}
        </ScrollView>
      </Screen>
    );
  }
}

export const mapDispatchToProps = dispatch => ({
  viewNotification: (notification) => {
    dispatch(notification.action);
  },
});

export default connect(undefined, mapDispatchToProps)(
  connectStyle(ext('NotificationDetailsScreen'))(NotificationDetailsScreen),
);
