import React from 'react';

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

import { formatDate } from '../shared/Calendar';
import EventImage from './EventImage';

/**
 * Component used to render single list event item
 */
export default class ListEventView extends React.Component {
  static propTypes = {
    onPress: React.PropTypes.func,
    action: React.PropTypes.func,
    event: React.PropTypes.object.isRequired,
    style: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.action = this.action.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.event);
  }

  action() {
    this.props.action(this.props.event);
  }

  render() {
    const { event, style } = this.props;
    return (
      <TouchableOpacity
        onPress={this.onPress}
        key={event.id}
        style={style}
      >
        <Row>
          <EventImage styleName="small rounded-corners" event={event} />
          <View styleName="vertical stretch space-between">
            <Subtitle styleName="">{event.name}</Subtitle>
            <Caption>{formatDate(event.startTime)}</Caption>
          </View>
          <Button styleName="right-icon" onPress={this.action}>
            <Icon name="add-event" />
          </Button>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
