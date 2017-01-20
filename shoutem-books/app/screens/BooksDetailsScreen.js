import React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import {
  Screen,
  Image,
  Divider,
  Caption,
  Title,
  Tile,
  RichMedia,
  ScrollView,
  View,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import { openURL } from 'shoutem.web-view';

import { formatBookCaption } from '../shared/formatBookCaption';
import { LinkButton } from '../components/LinkButton';
import Favorite from '../components/Favorite';

/* eslint-disable react/prefer-stateless-function */
class BooksDetailsScreen extends React.Component {
  static propTypes = {
    book: React.PropTypes.any,
    openURL: React.PropTypes.func,
    hasFavoriteButton: React.PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.renderFavoriteButton = this.renderFavoriteButton.bind(this);
  }

  renderFavoriteButton() {
    const { hasFavoriteButton, book } = this.props;

    if (hasFavoriteButton) {
      return (
        <Favorite item={book} />
      );
    }

    return null;
  }

  getTileStyle() {
    const { book } = this.props;

    if (!_.has(book, 'image.url')) {
      return {
        style: {
          backgroundColor: '#2c2c2c',
        },
      };
    }
    return null;
  }

  render() {
    const { book, openURL } = this.props;

    return (
      <Screen styleName="full-screen paper">
        <NavigationBar
          styleName="clear"
          animationName="solidify"
          renderRightComponent={this.renderFavoriteButton}
        />

        <ScrollView>
          <Image
            styleName="large-square hero"
            animationName="hero"
            source={{ uri: _.get(book, 'image.url') }}
          >
            <Tile
              animationName="hero"
              {...this.getTileStyle()}
            >
              <Title styleName="md-gutter-bottom">
                {book.title.toUpperCase()}
              </Title>
              <Caption styleName="md-gutter-bottom">{formatBookCaption(book)}</Caption>
              <LinkButton book={book} onPress={openURL} />
            </Tile>
          </Image>

          <Divider styleName="line" />

          <View styleName="solid">
            <RichMedia body={book.description} />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(
  undefined,
  { openURL }
)(BooksDetailsScreen);
