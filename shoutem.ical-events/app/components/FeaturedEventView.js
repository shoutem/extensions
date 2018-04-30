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
  ImageBackground,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { BaseEventItem } from './BaseEventItem';
import { formatDate } from '../services/Calendar';
import { ext } from '../const';

/**
 * A component used to render events
 */
export default class FeaturedEventView extends BaseEventItem {
  render() {
    const { event, styleName } = this.props;

    const containerStyleName = `sm-gutter featured ${styleName || ''}`;

    return (
      <TouchableOpacity key={event.id} onPress={this.onPress}>
        <View styleName={containerStyleName}>
          <ImageBackground styleName="placeholder featured" source={{ uri: this.props.imageUrl }}>
            <Tile>
              <Title styleName="md-gutter-bottom">
                {(event.name || '').toUpperCase()}
              </Title>
              <Caption>{formatDate(event.start)}</Caption>
              <Divider styleName="line small center" />
              <Caption styleName="md-gutter-bottom">{formatDate(event.end)}</Caption>
              <Button
                onPress={this.action}
                styleName="md-gutter-top"
              >
                <Icon name="add-event" />
                <Text>{I18n.t(ext('addToCalendarButton'))}</Text>
              </Button>
            </Tile>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    );
  }
}
