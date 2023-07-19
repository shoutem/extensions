import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
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

/**
 * A component used to render a single grid article item
 */
export class GridArticleView extends ArticleView {
  static propTypes = {
    articleId: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    date: PropTypes.string,
    imageUrl: PropTypes.string,
    title: PropTypes.string,
  };

  render() {
    const { hideModificationTimestamp, title, imageUrl, date } = this.props;

    const articleImage = imageUrl
      ? { uri: imageUrl }
      : assets.noImagePlaceholder;

    const momentDate = moment(date);
    const dateInfo =
      momentDate.isAfter(0) && !hideModificationTimestamp ? (
        <View styleName="horizontal">
          <Caption>{momentDate.fromNow()}</Caption>
        </View>
      ) : null;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Card styleName="flexible">
          <Image styleName="medium-wide placeholder" source={articleImage} />
          <View styleName="flexible content space-between">
            <Subtitle numberOfLines={3} styleName="lg-gutter-bottom">
              {title}
            </Subtitle>
            {dateInfo}
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}
