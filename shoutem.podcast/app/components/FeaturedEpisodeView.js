import React from 'react';
import moment from 'moment';

import {
  TouchableOpacity,
  Title,
  Caption,
  View,
  Tile,
  ImageBackground,
  Divider,
} from '@shoutem/ui';

import {
  EpisodeView,
} from './EpisodeView';

/**
 * A component used to render featured podcast episode
 */
export class FeaturedEpisodeView extends EpisodeView {
  render() {
    const { title, imageUrl, date, author } = this.props;

    const momentDate = moment(date);
    const dateInfo = momentDate.isAfter(0) ? (
      <Caption styleName="md-gutter-left">
        {momentDate.fromNow()}
      </Caption>
    ) : null;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <View styleName="sm-gutter featured">
          <ImageBackground
            source={{ uri: imageUrl }}
            styleName="featured placeholder"
          >
            <Tile>
              <Title>{(title || '').toUpperCase()}</Title>
              <View styleName="horizontal md-gutter-top" virtual>
                <Caption numberOfLines={1} styleName="collapsible">
                  {author}
                </Caption>
                {dateInfo}
              </View>
            </Tile>
          </ImageBackground>
        </View>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
