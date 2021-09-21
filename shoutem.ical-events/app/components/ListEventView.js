import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Subtitle,
  Caption,
  View,
  Row,
  Icon,
  TouchableOpacity,
  Divider,
  Button,
} from '@shoutem/ui';
import { formatToLocalDate } from '../services/Calendar';
/**
 * Component used to render single list event item
 */
export default class ListEventView extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    action: PropTypes.func,
    event: PropTypes.object.isRequired,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  onPress() {
    if (_.isFunction(this.props.onPress)) {
      this.props.onPress(this.props.event);
    }
  }

  action() {
    this.props.action(this.props.event);
  }

  render() {
    const { event, style } = this.props;
    return (
      <TouchableOpacity
        disabled={!_.isFunction(this.props.onPress)}
        onPress={this.onPress}
        key={event.id}
        style={style}
      >
        <Row>
          <View styleName="vertical stretch space-between sm-gutter-horizontal">
            <Subtitle>{event.name}</Subtitle>
            <Caption>{formatToLocalDate(event.start)}</Caption>
          </View>
          <Button styleName="tight clear" onPress={this.action}>
            <Icon name="add-event" />
          </Button>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
