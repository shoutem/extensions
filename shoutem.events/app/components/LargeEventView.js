import React from 'react';
import {
  TouchableOpacity,
  Title,
  Caption,
  View,
  Row,
  Icon,
  Button,
} from '@shoutem/ui';
import { formatDate } from '../shared/Calendar';
import { BaseEventItem } from './BaseEventItem';
import EventImage from './EventImage';

export default class LargeEventView extends BaseEventItem {
  static propTypes = {
    ...BaseEventItem.propTypes,
  };

  render() {
    const { event } = this.props;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <View styleName="md-gutter-bottom">
          <EventImage styleName="large-wide placeholder" event={event} />
          <Row>
            <View styleName="vertical stretch space-between">
              <Title numberOfLines={2}>{event.name}</Title>
              <View styleName="horizontal stretch space-between">
                <Caption>{formatDate(event.startTime)}</Caption>
                <Button styleName="tight clear" onPress={this.action}>
                  <Icon name="add-event" />
                </Button>
              </View>
            </View>
          </Row>
        </View>
      </TouchableOpacity>
    );
  }
}
