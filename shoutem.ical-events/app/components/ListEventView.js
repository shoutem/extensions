import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import {
  Subtitle,
  Caption,
  View,
  Row,
  Icon,
  TouchableOpacity,
  Divider,
  Button,
  Image
} from '@shoutem/ui';
import { formatToLocalDate } from '../services/Calendar';

/**
 * Component used to render single list event item
 */
export default class ListEventView extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    action: PropTypes.func,
    event: PropTypes.object.isRequired,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.action = this.action.bind(this);
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
          <Image
            styleName="placeholder small rounded-corners"
            source={{ uri: this.props.imageUrl }}
          />
          <View styleName="vertical stretch space-between sm-gutter-horizontal">
            <Subtitle>{event.name}</Subtitle>
            <Caption>{formatToLocalDate(event.start)}</Caption>
          </View>
          <Button
            styleName="tight clear"
            onPress={this.action}
          >
            <Icon name="add-event" />
          </Button>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
