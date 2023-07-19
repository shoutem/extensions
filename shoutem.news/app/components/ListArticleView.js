import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Caption,
  Divider,
  Image,
  Row,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { assets } from 'shoutem.layouts';
import { ArticleView } from './ArticleView';

/**
 * A component used to render a single list article item
 */
export class ListArticleView extends ArticleView {
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
        <Divider styleName="line" />
        <Row>
          <Image
            styleName="small rounded-corners placeholder"
            source={articleImage}
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

ListArticleView.propTypes = {
  articleId: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  date: PropTypes.string,
  hideModificationTimestamp: PropTypes.bool,
  imageUrl: PropTypes.string,
  title: PropTypes.string,
};

ListArticleView.defaultProps = {
  date: undefined,
  hideModificationTimestamp: false,
  imageUrl: undefined,
  title: undefined,
};
