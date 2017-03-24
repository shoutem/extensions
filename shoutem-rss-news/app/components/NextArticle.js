import React from 'react';
import {
  TouchableOpacity,
  Subtitle,
  Caption,
  Image,
  Tile,
} from '@shoutem/ui';

import { getLeadImageUrl } from 'shoutem.rss';

/**
 * A component used to render the next article info on
 * the article details screen.
 */
export default class NextArticle extends React.Component {
  static propTypes = {
    article: React.PropTypes.object.isRequired,
    openNextArticle: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    const { article, openNextArticle } = this.props;

    openNextArticle(article);
  }

  render() {
    const { article } = this.props;
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <Image
          styleName="large-ultra-wide placeholder"
          source={{ uri: getLeadImageUrl(article) }}
        >
          <Tile styleName="fill-parent overlay md-gutter-vertical lg-gutter-horizontal space-between">
            <Caption styleName="bold bright h-left">UP NEXT</Caption>
            <Subtitle styleName="bright h-left" numberOfLines={2}>{article.title}</Subtitle>
          </Tile>
        </Image>
      </TouchableOpacity>
    );
  }
}
