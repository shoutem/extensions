import React, { Component } from 'react';
import { getCollection } from '@shoutem/redux-io';
import { NavigationBar } from '@shoutem/ui/navigation';
import { LayoutAnimation } from 'react-native';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import {
  Screen,
  ListView,
  Spinner,
} from '@shoutem/ui';
import { EmptyStateView } from '@shoutem/ui-addons';

import { getFavoriteCollection, fetchFavoritesData } from '../helpers';
import { I18n } from 'shoutem.i18n';

import { ext } from '../const';

export class FavoritesListScreen extends Component {
  static propTypes = {
    title: React.PropTypes.string,
    favorites: React.PropTypes.array,
    favoriteCollection: React.PropTypes.array,
    fetchFavoritesData: React.PropTypes.func,
    itemsLoaded: React.PropTypes.bool,
    loading: React.PropTypes.bool,
  };

  static createMapStateToProps(schema, getStorage) {
    return (state) => {
      const favoriteCollection = getFavoriteCollection(schema, state);
      const favoriteIds = _.map(favoriteCollection, 'id');
      const favorites = getCollection(favoriteIds, state, schema);
      const storage = getStorage(state);
      const itemsLoaded = _.every(favoriteIds, (id) => _.has(storage, id));

      return {
        favorites,
        favoriteCollection,
        itemsLoaded,
      };
    };
  }

  static createMapDispatchToProps(actionCreators) {
    return (dispatch) => (
      bindActionCreators(
        {
          ...actionCreators,
          fetchFavoritesData,
        },
        dispatch,
      )
    );
  }

  constructor(props, context) {
    super(props, context);
    this.renderData = this.renderData.bind(this);
    this.shouldLoadFavoriteData = this.shouldLoadFavoriteData.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.state = {
      ...this.state,
      loading: false,
    };
  }

  componentWillMount() {
    const { favoriteCollection, itemsLoaded } = this.props;
    const { schema } = this.state;

    if (!itemsLoaded) {
      this.toggleLoading();
      this.props.fetchFavoritesData(schema, favoriteCollection)
      .then(() => this.toggleLoading());
    }
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  getNavBarProps() {
    const { title } = this.props;

    return { title };
  }

  toggleLoading() {
    const { loading } = this.state;

    this.setState({ loading: !loading });
  }

  shouldLoadFavoriteData() {
    const { favorites } = this.props;

    _.forEach(favorites, (item) => {
      if (_.isEmpty(item)) return true;
    });

    return false;
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

    return (
      <Screen>
        <NavigationBar {...this.getNavBarProps()} />
        {this.renderData(favorites)}
      </Screen>
    );
  }
}
