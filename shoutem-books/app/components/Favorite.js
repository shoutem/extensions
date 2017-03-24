import React from 'react';
import { connect } from 'react-redux';

import {
  Button,
  Icon,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { CmsListScreen } from 'shoutem.cms';
import { saveFavorite, deleteFavorite, isFavoriteItem } from 'shoutem.favorites';

import { ext } from '../const';

class Favorite extends React.Component {
  static propTypes = {
    item: React.PropTypes.any.isRequired,
    schema: React.PropTypes.string,
    saveFavorite: React.PropTypes.func,
    deleteFavorite: React.PropTypes.func,
    isFavorite: React.PropTypes.bool,
    iconStyle: React.PropTypes.string,
    buttonStyle: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  toggleFavorite() {
    const { item, schema, saveFavorite, isFavorite, deleteFavorite } = this.props;

    if (isFavorite) {
      deleteFavorite(item.id, schema);
    } else {
      saveFavorite({ id: item.id }, schema);
    }
  }

  renderIcon() {
    const { isFavorite, iconStyle } = this.props;

    return isFavorite ?
      <Icon name="add-to-favorites-full" styleName={iconStyle} />
      : <Icon name="add-to-favorites" styleName={iconStyle} />;
  }

  render() {
    const { buttonStyle } = this.props;
    return (
      <Button
        styleName={`clear textual tight ${buttonStyle}`}
        onPress={this.toggleFavorite}
      >
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
  deleteFavorite,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('Favorite'), {})(Favorite),
);
