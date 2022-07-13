import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { getCollection } from '@shoutem/redux-io';
import { Screen, ListView, Spinner, EmptyStateView } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { getFavoriteCollection, fetchFavoritesData } from '../helpers';

export class FavoritesListScreen extends PureComponent {
  static propTypes = {
    favorites: PropTypes.array,
    favoriteCollection: PropTypes.array,
    fetchFavoritesData: PropTypes.func,
    itemsLoaded: PropTypes.bool,
    loading: PropTypes.bool,
  };

  static createMapStateToProps(schema, getStorage) {
    return state => {
      const favoriteCollection = getFavoriteCollection(schema, state);
      const favoriteIds = _.map(favoriteCollection, 'id');
      const favorites = getCollection(favoriteIds, state, schema);
      const storage = getStorage(state);
      const itemsLoaded = _.every(favoriteIds, id => _.has(storage, id));

      return {
        favorites,
        favoriteCollection,
        itemsLoaded,
      };
    };
  }

  static createMapDispatchToProps(actionCreators) {
    return dispatch =>
      bindActionCreators(
        {
          ...actionCreators,
          fetchFavoritesData,
        },
        dispatch,
      );
  }

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      ...this.state,
      loading: false,
    };
  }

  componentDidMount() {
    const { favoriteCollection, itemsLoaded } = this.props;
    const { schema } = this.state;

    if (!itemsLoaded) {
      this.toggleLoading();
      this.props
        .fetchFavoritesData(schema, favoriteCollection)
        .then(() => this.toggleLoading());
    }
  }

  toggleLoading() {
    const { loading } = this.state;

    this.setState({ loading: !loading });
  }

  shouldLoadFavoriteData() {
    const { favorites } = this.props;

    _.forEach(favorites, item => _.isEmpty(item));
  }

  renderData(favoriteData) {
    const { loading } = this.state;

    if (loading) return <Spinner styleName="md-gutter-top" />;

    if (_.isEmpty(favoriteData)) {
      return (
        <EmptyStateView
          onRetry={this.refreshData}
          message={I18n.t(ext('noFavoritesMessage'))}
          icon="add-to-favorites-on"
        />
      );
    }

    return (
      <ListView
        data={favoriteData}
        renderRow={this.renderFavorite}
        pageSize={20}
      />
    );
  }

  render() {
    const { favorites } = this.props;

    return <Screen>{this.renderData(favorites)}</Screen>;
  }
}
