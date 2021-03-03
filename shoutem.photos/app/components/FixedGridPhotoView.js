import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  TouchableOpacity,
  View,
  Image,
  Caption,
  Card,
  Subtitle,
} from '@shoutem/ui';
import { BasePhotoView } from './BasePhotoView';

/**
 * A component used to render a single grid photo item
 */
export default class FixedGridPhotoView extends BasePhotoView {
  render() {
    const { photo } = this.props;
    const source = _.get(photo, 'source');

    const momentDate = moment(photo.timeUpdated);
    const dateInfo = momentDate.isAfter(0) ? (
      <View styleName="horizontal">
        <Caption>{momentDate.fromNow()}</Caption>
      </View>
    ) : null;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Card styleName="flexible">
          <Image styleName="medium-wide" source={source} />
          <View styleName="space-between">
            <Subtitle numberOfLines={3} styleName="lg-gutter-bottom">
              {photo.title}
            </Subtitle>
            {dateInfo}
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}
