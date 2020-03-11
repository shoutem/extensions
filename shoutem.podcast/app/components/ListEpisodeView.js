import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import {
  TouchableOpacity,
  Subtitle,
  Caption,
  View,
  Image,
  Row,
  Divider,
} from '@shoutem/ui';

import { EpisodeView } from './EpisodeView';

/**
 * A component used to render a single list episode item
 */
export class ListEpisodeView extends EpisodeView {
  static propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    date: PropTypes.string,
  };

  render() {
    const { title, imageUrl, date } = this.props;

    const momentDate = moment(date);
    const dateInfo = momentDate.isAfter(0) ? (
      <Caption>{momentDate.fromNow()}</Caption>
    ) : null;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Divider styleName="line" />
        <Row>
          <Image
            source={{ uri: imageUrl }}
            styleName="small rounded-corners placeholder"
          />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2}>{title}</Subtitle>
            {dateInfo}
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
