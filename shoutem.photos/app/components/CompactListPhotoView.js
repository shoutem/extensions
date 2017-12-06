import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  TouchableOpacity,
  View,
  Title,
  Caption,
  Image,
  Row,
  Subtitle,
  Divider,
} from '@shoutem/ui';

import { BasePhotoView } from './BasePhotoView';

/**
 * A component used to render a single list photo item
 */
export default class CompactListPhotoView extends BasePhotoView {
  render() {
    const { photo } = this.props;

    const title = _.get(photo, 'title');
    const source = _.get(photo, 'source');

    return (
      <View key={photo.id}>
        <TouchableOpacity onPress={this.onPress}>
          <Row>
            <Image styleName="small rounded-corners" source={source} />
            <View styleName="vertical stretch space-between">
              <Subtitle>{title}</Subtitle>
              <Caption>{moment(photo.timeUpdated).fromNow()}</Caption>
            </View>
          </Row>
        </TouchableOpacity>
        <Divider styleName="line" />
      </View>
    );
  }
}
