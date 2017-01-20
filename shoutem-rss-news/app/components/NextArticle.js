import React from 'react';
import {
  TouchableOpacity,
  Subtitle,
  Caption,
  Image,
  View,
} from '@shoutem/ui';
import { navigateTo } from '@shoutem/core/navigation';
import { connect } from 'react-redux';

import { getLeadImageUrl } from 'shoutem.rss';

import { ext } from '../const';

/**
 * A component used to render the next article info on
 * the article details screen.
 */
class NextArticle extends React.Component {
  static propTypes = {
    article: React.PropTypes.object.isRequired,
    feedUrl: React.PropTypes.string.isRequired,
    navigateTo: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.openNextArticle = this.openNextArticle.bind(this);
  }

  openNextArticle() {
    const { article, feedUrl, navigateTo } = this.props;
    const route = {
      screen: ext('ArticleDetailsScreen'),
      props: {
        article,
        feedUrl,
        showNext: true,
      },
    };

    navigateTo(route);
  }

  render() {
    const { article } = this.props;
    return (
      <TouchableOpacity onPress={this.openNextArticle}>
        <Image
          styleName="large-ultra-wide"
          source={{ uri: getLeadImageUrl(article) }}
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

export default connect(null, { navigateTo })(NextArticle);
