import React from 'react';
import {
  TouchableOpacity,
  Title,
  Caption,
  View,
  Tile,
  Button,
  Text,
  Icon,
  Divider,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { formatToLocalDate } from '../services/Calendar';
import { ext } from '../const';
import { BaseEventItem } from './BaseEventItem';

/**
 * A component used to render featured events
 */
export default class FeaturedEventView extends BaseEventItem {
  render() {
    const { event, styleName } = this.props;

    const containerStyleName = `sm-gutter featured ${styleName || ''}`;

    return (
      <TouchableOpacity key={event.id} onPress={this.onPress}>
        <View styleName={containerStyleName}>
          <Tile styleName="text-centric">
            <Title styleName="md-gutter-vertical">
              {(event.name || '').toUpperCase()}
            </Title>
            <Caption>{formatToLocalDate(event.start)}</Caption>
            <Divider styleName="line small center" />
            <Caption styleName="md-gutter-bottom">
              {formatToLocalDate(event.end)}
            </Caption>
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
