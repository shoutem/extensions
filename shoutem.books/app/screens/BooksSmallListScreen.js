import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import { isBusy, isInitialized } from '@shoutem/redux-io';
import { Favorite } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import { CompactListLayout } from 'shoutem.layouts';
import LinkIconButton from '../components/LinkIconButton';
import SmallListBooksView from '../components/SmallListBooksView';
import { ext } from '../const';
import {
  BooksListScreen,
  mapDispatchToProps,
  mapStateToProps,
} from './BooksListScreen';

const schema = ext('Books');

function subtitleLeftResolver(book) {
  if (book.author && book.price) {
    return `${book.author}    •   ${book.price}`;
  }
  return book.author;
}

function renderActions(book) {
  return (
    <>
      <Favorite item={book} schema={schema} />
      <LinkIconButton book={book} />
    </>
  );
}

class BooksSmallListScreen extends BooksListScreen {
  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state.renderCategoriesInline = false;
  }

  renderRow(book) {
    return (
      <SmallListBooksView
        key={book.id}
        book={book}
        onPress={this.openDetailsScreen}
        hasFavoriteButton={this.props.hasFavorites}
      />
    );
  }

  renderData(data) {
    const initialLoad =
      isBusy(data) && (!data || data?.length === 0 || !isInitialized(data));

    if (initialLoad) {
      return this.renderLoading();
    }

    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    const titleResolver = 'title';
    const imageUrlResolver = 'image.url';
    const subtitleRightResolver = 'book.price';

    return (
      <CompactListLayout
        data={data}
        loading={isBusy(data)}
        onLoadMore={this.loadMore}
        onPress={this.openDetailsScreen}
        onRefresh={this.refreshData}
        renderActions={renderActions}
        emptyStateAction={this.refreshData}
        emptyStateIconName="error"
        emptyStateMessage={I18n.t(
          'shoutem.application.preview.noContentErrorMessage',
        )}
        imageUrlResolver={imageUrlResolver}
        subtitleLeftResolver={subtitleLeftResolver}
        subtitleRightResolver={subtitleRightResolver}
        titleResolver={titleResolver}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BooksSmallListScreen);
