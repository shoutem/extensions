import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import SmallListBooksView from '../components/SmallListBooksView';
import {
  BooksListScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './BooksListScreen';

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
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BooksSmallListScreen);
