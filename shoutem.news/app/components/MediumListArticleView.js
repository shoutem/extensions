import React from 'react';
import moment from 'moment';
import {
  Caption,
  Card,
  Image,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { assets } from 'shoutem.layouts';
import { ArticleView } from './ArticleView';

export class MediumListArticleView extends ArticleView {
  render() {
    const { hideModificationTimestamp, title, imageUrl, date } = this.props;

    const articleImage = imageUrl
      ? { uri: imageUrl }
      : assets.noImagePlaceholder;

    const momentDate = moment(date);
    const dateInfo =
      momentDate.isAfter(0) && !hideModificationTimestamp ? (
        <Caption>{momentDate.fromNow()}</Caption>
      ) : null;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Card styleName="horizontal">
          <Image
            styleName="medium-portrait rounded-corners placeholder"
            source={articleImage}
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
