import React, { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CmsListScreen } from 'shoutem.cms';
import { getFavoriteItems, fetchFavoritesData } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import { NavigationBar, navigateTo } from 'shoutem.navigation';
import {
  isError,
  getCollection,
  isBusy,
  isInitialized,
} from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { ListView, Screen, EmptyStateView } from '@shoutem/ui';
import ListBooksView from '../components/ListBooksView';
import { ext } from '../const';

class MyBooksScreen extends PureComponent {
  static propTypes = {
    navigateTo: PropTypes.func,
    title: PropTypes.string,
    data: PropTypes.array.isRequired,
    favorites: PropTypes.object.isRequired,
    fetchFavoritesData: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = {
      schema: ext('Books'),
    };
  }

  componentDidMount() {
    const { fetchFavoritesData, favorites } = this.props;

    fetchFavoritesData(this.state.schema, favorites[this.state.schema]);
  }

  componentDidUpdate(prevProps) {
    const { fetchFavoritesData, favorites } = this.props;

    if (prevProps.favorites !== favorites) {
      fetchFavoritesData(this.state.schema, favorites[this.state.schema]);
    }
  }

  openDetailsScreen(book) {
    const { navigateTo } = this.props;

    navigateTo({
      screen: ext('BooksDetailsScreen'),
      props: {
        book,
        hasFavoriteButton: true,
      },
    });
  }

  isCollectionValid(collection) {
    if (!isInitialized(collection) || isBusy(collection)) {
      // The collection is loading, treat it as valid for now
      return true;
    }

    // The collection is considered valid if it is not empty
    return !_.isEmpty(collection);
  }

  renderPlaceholderView() {
    const { data } = this.props;

    const message = isError(data)
      ? I18n.t('shoutem.application.unexpectedErrorMessage')
      : I18n.t('shoutem.application.preview.noContentErrorMessage');

    return <EmptyStateView icon="books" message={message} />;
  }

  renderRow(book) {
    return (
      <ListBooksView
        key={book.id}
        book={book}
        onPress={this.openDetailsScreen}
        hasFavoriteButton
      />
    );
  }

  renderData(data) {
    if (!this.isCollectionValid(data)) {
      return this.renderPlaceholderView();
    }

    const loading = isBusy(data) || !isInitialized(data);

    return (
      <ListView data={data} renderRow={this.renderRow} loading={loading} />
    );
  }

  render() {
    const { title, data } = this.props;
    return (
      <Screen>
        <NavigationBar title={title} />
        {this.renderData(data)}
      </Screen>
    );
  }
}

export const mapStateToProps = state => ({
  favorites: getFavoriteItems(state),
  data: getCollection(state[ext()].favoriteBooks, state),
});

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  navigateTo,
  fetchFavoritesData,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('MyBooksScreen'), {})(MyBooksScreen));
