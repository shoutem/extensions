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
import EventImage from './EventImage';
import { BaseEventItem } from './BaseEventItem';
import { formatDate } from '../shared/Calendar';
import { ext } from '../const';

/**
 * A component used to render featured news articles
 */
export default class FeaturedArticleView extends BaseEventItem {
  render() {
    const { event, styleName } = this.props;

    const containerStyleName = `sm-gutter featured ${styleName || ''}`;

    return (
      <TouchableOpacity key={event.id} onPress={this.onPress}>
        <View styleName={containerStyleName}>
          <EventImage styleName="featured" event={event}>
            <Tile>
              <Title styleName="md-gutter-bottom">
                {(event.name || '').toUpperCase()}
              </Title>
              <Caption>{formatDate(event.startTime)}</Caption>
              <Divider styleName="line small center" />
              <Caption styleName="md-gutter-bottom">{formatDate(event.endTime)}</Caption>
              <Button
                onPress={this.action}
                styleName="md-gutter-top"
              >
                <Icon name="add-event" />
                <Text>{I18n.t(ext('addToCalendarButton'))}</Text>
              </Button>
            </Tile>
          </EventImage>
        </View>
      </TouchableOpacity>
    );
  }
}
