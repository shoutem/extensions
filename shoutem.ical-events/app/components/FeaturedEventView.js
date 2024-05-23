import React from 'react';
import {
  Button,
  Caption,
  Divider,
  Icon,
  Text,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { formatToAllDayDate, formatToLocalDate } from '../services/Calendar';
import { BaseEventItem } from './BaseEventItem';

/**
 * A component used to render featured events
 */
export default class FeaturedEventView extends BaseEventItem {
  render() {
    const { event, styleName } = this.props;

    const caption = event.allDay
      ? formatToAllDayDate(event.start, event.end)
      : formatToLocalDate(event.start);

    const containerStyleName = `sm-gutter featured ${styleName || ''}`;

    return (
      <TouchableOpacity key={event.id} onPress={this.onPress}>
        <View styleName={containerStyleName}>
          <Tile styleName="text-centric">
            <Title styleName="md-gutter-vertical">
              {(event.name || '').toUpperCase()}
            </Title>
            <Caption>{caption}</Caption>
            {!event.allDay && (
              <>
                <Divider styleName="line small center" />
                <Caption styleName="md-gutter-bottom">
                  {formatToLocalDate(event.end)}
                </Caption>
              </>
            )}
            <Button onPress={this.action} styleName="md-gutter-top">
              <Icon name="add-event" />
              <Text>{I18n.t(ext('addToCalendarButton'))}</Text>
            </Button>
          </Tile>
        </View>
      </TouchableOpacity>
    );
  }
}
