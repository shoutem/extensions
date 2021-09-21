import React from 'react';
import {
  Caption,
  Icon,
  TouchableOpacity,
  Divider,
  Button,
  Tile,
  View,
  Title,
} from '@shoutem/ui';
import { formatDate } from '../shared/Calendar';
import { BaseEventItem } from './BaseEventItem';
import EventImage from './EventImage';

export default class TileEventView extends BaseEventItem {
  static propTypes = {
    ...BaseEventItem.propTypes,
  };

  render() {
    const { event } = this.props;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <EventImage styleName="large-banner placeholder" event={event}>
          <Tile>
            <View styleName="actions">
              <Button styleName="tight clear" onPress={this.action}>
                <Icon name="add-event" />
              </Button>
            </View>
            <Title numberOfLines={3}>{event.name.toUpperCase()}</Title>
            <Caption>{formatDate(event.startTime)}</Caption>
          </Tile>
        </EventImage>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
