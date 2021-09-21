import React, { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { Favorite } from 'shoutem.favorites';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { openURL } from 'shoutem.web-view';
import {
  Screen,
  ImageBackground,
  Divider,
  Caption,
  Title,
  Tile,
  SimpleHtml,
  ScrollView,
  View,
  ShareButton,
} from '@shoutem/ui';
import { formatBookCaption } from '../shared/formatBookCaption';
import { LinkButton } from '../components/LinkButton';

export default class BooksDetailsScreen extends PureComponent {
  static propTypes = {
    book: PropTypes.any,
    hasFavoriteButton: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    props.navigation.setOptions(this.getNavBarProps());
  }

  getNavBarProps() {
    return {
      ...composeNavigationStyles(['clear', 'solidify']),
      headerRight: this.headerRight,
      title: '',
    };
  }

  headerRight(props) {
    const { book, hasFavoriteButton } = getRouteParams(this.props);

    return (
      <View styleName="horizontal">
        {hasFavoriteButton && (
          <Favorite
            item={book}
            schema={book.type}
            buttonStyle={book.buyUrl ? null : 'md-gutter-right'}
            iconProps={{ style: props.tintColor }}
          />
        )}
        {!!book.buyUrl && (
          <ShareButton
            styleName="clear"
            iconProps={{ style: props.tintColor }}
            url={book.buyUrl}
            title={book.title}
          />
        )}
      </View>
    );
  }

  render() {
    const { route } = this.props;

    const { book } = route.params;

    return (
      <Screen styleName="paper">
        <ScrollView>
          <ImageBackground
            styleName="large-square placeholder"
            animationName="hero"
            source={{ uri: _.get(book, 'image.url') }}
          >
            <Tile animationName="hero">
              <Title numberOfLines={2} styleName="md-gutter-bottom">
                {book.title.toUpperCase()}
              </Title>
              <Caption styleName="md-gutter-bottom">
                {formatBookCaption(book)}
              </Caption>
              <LinkButton book={book} onPress={openURL} />
            </Tile>
          </ImageBackground>

          <Divider styleName="line" />

          <View styleName="solid">
            <SimpleHtml body={book.description} />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}
