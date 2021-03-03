import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  TouchableOpacity,
  View,
  Title,
  Caption,
  Image,
  Tile,
} from '@shoutem/ui';
import { BasePhotoView } from './BasePhotoView';

/**
 * A component used to render a single list photo item
 */
export default class LargeListPhotoView extends BasePhotoView {
  render() {
    const { photo } = this.props;

    const title = _.get(photo, 'title');
    const source = _.get(photo, 'source');

    return (
      <View key={photo.id}>
        <TouchableOpacity onPress={this.onPress}>
          <Tile>
            <Image styleName="large-banner" source={source} />
            <View styleName="content md-gutter">
              <Title numberOfLines={2}>{title.toUpperCase()}</Title>
              <Caption>{moment(photo.timeUpdated).fromNow()}</Caption>
            </View>
          </Tile>
        </TouchableOpacity>
      </View>
    );
  }
}
