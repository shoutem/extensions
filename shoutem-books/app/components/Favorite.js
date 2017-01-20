import React from 'react';
import { connect } from 'react-redux';

import {
  Button,
  Icon,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { CmsListScreen } from 'shoutem.cms';
import { saveFavorite, isFavoriteItem } from 'shoutem.favorites';

import { ext } from '../const';

class Favorite extends React.Component {
  static propTypes = {
    item: React.PropTypes.any.isRequired,
    saveFavorite: React.PropTypes.func,
    isFavorite: React.PropTypes.bool,
    iconStyle: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  toggleFavorite() {
    const { item, saveFavorite } = this.props;

    saveFavorite(item.id, ext('Books'));
  }

  renderIcon() {
    const { isFavorite, iconStyle } = this.props;

    return isFavorite ?
      <Icon name="add-to-favorites-full" styleName={iconStyle} />
      : <Icon name="add-to-favorites" styleName={iconStyle} />;
  }

  render() {
    return (
      <Button styleName="clear" onPress={this.toggleFavorite}>
        {this.renderIcon()}
      </Button>
    );
  }
}

export const mapStateToProps = (state, ownProps) => ({
  isFavorite: isFavoriteItem(state, ext('Books'), ownProps.item.id),
});

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  saveFavorite,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('Favorite'), {})(Favorite)
);
