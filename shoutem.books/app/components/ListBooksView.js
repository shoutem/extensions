import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Caption,
  Divider,
  ImageBackground,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { CmsListScreen } from 'shoutem.cms';
import { Favorite } from 'shoutem.favorites';
import { assets } from 'shoutem.layouts';
import { formatBookCaption } from '../shared/formatBookCaption';
import LinkIconButton from './LinkIconButton';

class ListBooksView extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    book: PropTypes.object.isRequired,
    hasFavoriteButton: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.openDetailsScreen = this.openDetailsScreen.bind(this);
  }

  openDetailsScreen() {
    const { onPress, book } = this.props;
    onPress(book);
  }

  render() {
    const { book, hasFavoriteButton } = this.props;
    const favorites = hasFavoriteButton ? (
      <Favorite item={book} schema={book.type} />
    ) : null;
    const addToCartButton = <LinkIconButton book={book} />;
    const bookImage = book.image
      ? { uri: book.image.url }
      : assets.noImagePlaceholder;

    return (
      <TouchableOpacity virtual onPress={this.openDetailsScreen}>
        <ImageBackground
          styleName="large-banner placeholder"
          source={bookImage}
        >
          <Tile>
            <View virtual styleName="actions horizontal">
              {favorites}
              {addToCartButton}
            </View>
            <Title numberOfLines={2}>{book.title.toUpperCase()}</Title>

            <Caption>{formatBookCaption(book)}</Caption>
          </Tile>
        </ImageBackground>

        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({});

export default connect(undefined, mapDispatchToProps)(ListBooksView);
