import React from 'react';
import moment from 'moment';
import {
  TouchableOpacity,
  Subtitle,
  Caption,
  View,
  Image,
  Row,
  Divider,
} from '@shoutem/ui';

import { getLeadImageUrl } from 'shoutem.rss';

/**
 * A component used to render a single list article item
 */
export default class ListArticleView extends React.Component {
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
    null : (<Caption>{moment(article.timeUpdated).fromNow()}</Caption>);

    return (
      <TouchableOpacity key={article.id} onPress={this.onPress}>
        <Divider styleName="line" />
        <Row>
          <Image
            styleName="small rounded-corners placeholder"
            source={{ uri: getLeadImageUrl(article) }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2}>{article.title}</Subtitle>
            {dateFormat}
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
