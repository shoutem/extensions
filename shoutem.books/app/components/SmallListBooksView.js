import React, { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Favorite } from 'shoutem.favorites';
import {
  Image,
  Subtitle,
  Row,
  View,
  Divider,
  TouchableOpacity,
  Caption,
} from '@shoutem/ui';
import { formatBookCaption } from '../shared/formatBookCaption';
import LinkIconButton from './LinkIconButton';

class SmallListBooksView extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    book: PropTypes.object.isRequired,
    hasFavoriteButton: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.book);
  }

  render() {
    const { book, hasFavoriteButton } = this.props;
    const favorites = hasFavoriteButton ? (
      <Favorite item={book} schema={book.type} />
    ) : null;
    const addToCartButton = <LinkIconButton book={book} />;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Row>
          <Image
            styleName="small rounded-corners placeholder"
            source={{ uri: _.get(book, 'image.url') }}
          />

          <View styleName="vertical stretch space-between">
            <Subtitle>{book.title}</Subtitle>
            <Caption>{formatBookCaption(book)}</Caption>
          </View>

          {favorites}
          {addToCartButton}
        </Row>

        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export default connect(undefined, {})(SmallListBooksView);
