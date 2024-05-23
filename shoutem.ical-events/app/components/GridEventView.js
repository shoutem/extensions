import React from 'react';
import {
  Button,
  Caption,
  Card,
  Icon,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { formatToAllDayDate, formatToLocalDate } from '../services/Calendar';
import { BaseEventItem } from './BaseEventItem';

/**
 * A component used to render a single grid event item
 */
export default class extends BaseEventItem {
  render() {
    const { event } = this.props;

    const caption = event.allDay
      ? formatToAllDayDate(event.start, event.end)
      : formatToLocalDate(event.start);

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Card styleName="flexible">
          <View styleName="content">
            <Subtitle numberOfLines={3}>{event.name}</Subtitle>
            <View styleName="flexible horizontal v-end space-between">
              <Caption styleName="collapsible">{caption}</Caption>
              <Button styleName="tight clear" onPress={this.action}>
                <Icon name="add-event" />
              </Button>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}
