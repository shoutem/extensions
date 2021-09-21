import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { openURL } from 'shoutem.web-view';
import { Button, Icon } from '@shoutem/ui';

export default class LinkIconButton extends PureComponent {
  static propTypes = {
    book: PropTypes.any,
  };

  render() {
    const { book } = this.props;

    if (book.buyUrl) {
      return (
        <Button
          styleName="tight clear md-gutter-left"
          onPress={() => openURL(book.buyUrl, book.title)}
        >
          <Icon name="cart" />
        </Button>
      );
    }

    return null;
  }
}
