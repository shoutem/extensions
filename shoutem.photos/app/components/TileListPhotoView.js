import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  TouchableOpacity,
  View,
  Title,
  Caption,
  ImageBackground,
  Tile,
  Divider,
} from '@shoutem/ui';
import { BasePhotoView } from './BasePhotoView';

/**
 * A component used to render a single list photo item
 */
export default class TileListPhotoView extends BasePhotoView {
  render() {
    const { photo } = this.props;

    const title = _.get(photo, 'title');
    const source = _.get(photo, 'source');

    return (
      <View key={photo.id}>
        <TouchableOpacity onPress={this.onPress}>
          <ImageBackground styleName="large-banner" source={source}>
            <Tile>
              <Title>{title.toUpperCase()}</Title>
              <Caption>{moment(photo.timeUpdated).fromNow()}</Caption>
            </Tile>
          </ImageBackground>
        </TouchableOpacity>
        <Divider styleName="line" />
      </View>
    );
  }
}
