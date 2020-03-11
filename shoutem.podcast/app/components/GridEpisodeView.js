import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import {
  TouchableOpacity,
  Subtitle,
  Caption,
  Card,
  View,
  Image,
} from '@shoutem/ui';

import { EpisodeView } from './EpisodeView';

/**
 * A component used to render a single grid episode item
 */
export class GridEpisodeView extends EpisodeView {
  static propTypes = {
    onPress: PropTypes.func,
    episodeId: PropTypes.string,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    date: PropTypes.string,
  };

  render() {
    const { title, imageUrl, date } = this.props;

    const momentDate = moment(date);
    const dateInfo = momentDate.isAfter(0) ? (
      <View styleName="horizontal">
        <Caption>{momentDate.fromNow()}</Caption>
      </View>
    ) : null;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Card styleName="flexible">
          <Image
            source={{ uri: imageUrl }}
            styleName="medium-wide placeholder"
          />
          <View styleName="flexible content space-between">
            <Subtitle numberOfLines={3} styleName="lg-gutter-bottom">{title}</Subtitle>
            {dateInfo}
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}
