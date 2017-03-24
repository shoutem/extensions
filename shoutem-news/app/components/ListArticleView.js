import React from 'react';
import _ from 'lodash';
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

    return (
      <TouchableOpacity key={article.id} onPress={this.onPress}>
        <Divider styleName="line" />
        <Row>
          <Image
            styleName="small rounded-corners placeholder"
            source={{ uri: _.get(article, 'image.url') }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2}>{article.title}</Subtitle>
            <Caption>{moment(article.timeUpdated).fromNow()}</Caption>
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
