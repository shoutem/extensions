import React from 'react';
import {
  TouchableOpacity,
  Subtitle,
  Caption,
  Image,
  View,
} from '@shoutem/ui';
import _ from 'lodash';

/**
 * A component used to render the next article info on
 * the article details screen.
 */
export default class NextArticle extends React.Component {
  static propTypes = {
    article: React.PropTypes.object.isRequired,
    openArticle: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    const { article, openArticle } = this.props;
    openArticle(article);
  }

  render() {
    const { article } = this.props;
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <Image
          styleName="large-ultra-wide"
          source={{ uri: _.get(article, 'image.url') }}
        >
          <View styleName="fill-parent overlay vertical md-gutter space-between">
            <Caption styleName="bold bright">UP NEXT</Caption>
            <Subtitle styleName="bright" numberOfLines={2}>{article.title}</Subtitle>
          </View>
        </Image>
      </TouchableOpacity>
    );
  }
}
