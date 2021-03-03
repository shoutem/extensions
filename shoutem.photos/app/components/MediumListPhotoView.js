import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  TouchableOpacity,
  View,
  Caption,
  Image,
  Card,
  Subtitle,
} from '@shoutem/ui';
import { BasePhotoView } from './BasePhotoView';

/**
 * A component used to render a single list photo item
 */
export default class MediumListPhotoView extends BasePhotoView {
  render() {
    const { photo } = this.props;

    const title = _.get(photo, 'title');
    const source = _.get(photo, 'source');

    const momentDate = moment(photo.timeUpdated);
    const dateInfo = momentDate.isAfter(0) ? (
      <View styleName="horizontal">
        <Caption>{momentDate.fromNow()}</Caption>
      </View>
    ) : null;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Card styleName="horizontal">
          <Image
            styleName="medium-portrait rounded-corners placeholder"
            source={source}
          />
          <View styleName="content pull-left space-between rounded-corners">
            <Subtitle numberOfLines={3}>{title}</Subtitle>
            <View styleName="horizontal stretch space-between v-center">
              {dateInfo}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}
