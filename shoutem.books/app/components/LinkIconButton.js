import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CmsListScreen } from 'shoutem.cms';
import { openURL } from 'shoutem.web-view';
import { Button, Icon } from '@shoutem/ui';

class LinkIconButton extends PureComponent {
  static propTypes = {
    book: PropTypes.any,
    openURL: PropTypes.func,
  };

  render() {
    const { book, openURL } = this.props;

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

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  openURL,
});

export default connect(undefined, mapDispatchToProps)(LinkIconButton);
