import React from 'react';
import _ from 'lodash';
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
export default class FeaturedArticleView extends React.Component {
  static propTypes = {
    onPress: React.PropTypes.func,
    article: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.article);
  }

  render() {
    const { article } = this.props;

    /* eslint-disable no-multi-spaces */
    return (
      <TouchableOpacity key={article.id} onPress={this.onPress}>
        <View styleName="sm-gutter featured">
          <Image
            styleName="featured"
            source={{ uri: _.get(article, 'image.url') }}
          >
            <Tile>
              <Title>{(article.title || '').toUpperCase()}</Title>
              <View styleName="horizontal md-gutter-top" virtual>
                <Caption styleName="collapsible" numberOfLines={1}>{article.newsAuthor}</Caption>
                <Caption styleName="md-gutter-left">
                  {moment(article.timeUpdated).fromNow()}
                </Caption>
              </View>
            </Tile>
          </Image>
        </View>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
