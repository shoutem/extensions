import React from 'react';
import {
  TouchableOpacity,
  Subtitle,
  Caption,
  Card,
  View,
  Image,
} from '@shoutem/ui';
import moment from 'moment';

import { getLeadImageUrl } from 'shoutem.rss';

/**
 * A component used to render a single grid article item
 */
export default class GridArticleView extends React.Component {
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
    const dateFormat = moment(article.timeUpdated).isBefore(0) ?
    null : (<Caption styleName="sm-gutter-left">{moment(article.timeUpdated).fromNow()}</Caption>);

    return (
      <TouchableOpacity key={article.id} onPress={this.onPress}>
        <Card styleName="flexible">
          <Image
            styleName="medium-wide"
            source={{ uri: getLeadImageUrl(article) }}
            defaultSource={require('../assets/images/image-fallback.png')}
          />
          <View styleName="content">
            <Subtitle numberOfLines={3}>{article.title}</Subtitle>
            <View styleName="horizontal">
              <Caption styleName="collapsible" numberOfLines={1}>{article.author}</Caption>
              { dateFormat }
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}
