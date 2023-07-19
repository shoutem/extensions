import React from 'react';
import moment from 'moment';
import {
  Caption,
  Image,
  Row,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { assets } from 'shoutem.layouts';
import { ArticleView } from './ArticleView';

export class LargeListArticleView extends ArticleView {
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
        <View styleName="md-gutter-bottom">
          <Image styleName="large-wide placeholder" source={articleImage} />
          <Row>
            <View styleName="vertical stretch space-between">
              <Title numberOfLines={2}>{title}</Title>
              {dateInfo}
            </View>
          </Row>
        </View>
      </TouchableOpacity>
    );
  }
}
