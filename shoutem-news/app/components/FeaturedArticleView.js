import React from 'react';
import {
  TouchableOpacity,
  Title,
  Caption,
  View,
  Tile,
  Image,
  Divider,
} from '@shoutem/ui';

import moment from 'moment';

/**
 * A component used to render featured news articles
 */
export class FeaturedArticleView extends React.Component {
  static propTypes = {
    onPress: React.PropTypes.func,
    articleId: React.PropTypes.string,
    title: React.PropTypes.string,
    author: React.PropTypes.string,
    imageUrl: React.PropTypes.string,
    date: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.articleId);
  }

  render() {
    const { title, imageUrl, date, author } = this.props;

    const momentDate = moment(date);
    const dateInfo = momentDate.isAfter(0) ? (
      <Caption styleName="md-gutter-left">
        {momentDate.fromNow()}
      </Caption>
    ) : null;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <View styleName="sm-gutter featured">
          <Image
            styleName="featured placeholder"
            source={{ uri: imageUrl }}
          >
            <Tile>
              <Title>{(title || '').toUpperCase()}</Title>
              <View styleName="horizontal md-gutter-top" virtual>
                <Caption styleName="collapsible" numberOfLines={1}>{author}</Caption>
                {dateInfo}
              </View>
            </Tile>
          </Image>
        </View>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
