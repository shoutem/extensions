import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { I18n } from 'shoutem.i18n';
import { NavigationBar, navigateBack } from 'shoutem.navigation';

import { connectStyle } from '@shoutem/theme';
import {
  Button,
  EmptyStateView,
  ListView,
  Row,
  Text,
  TouchableOpacity,
  SearchField,
  Screen,
  Subtitle,
  View,
} from '@shoutem/ui';

import ProductsList from '../components/ProductsList';
import { shop as shopShape } from '../components/shapes';
import { refreshProducts } from '../redux/actionCreators';
import { ext } from '../const';

const { func } = PropTypes;

const renderCancelButton = onPress => (
  <Button styleName="clear" onPress={onPress}>
    <Subtitle>{I18n.t(ext('cancelSearchButton'))}</Subtitle>
  </Button>
);

class SearchProductsScreen extends PureComponent {
  static propTypes = {
    // Called when the user cancels the search
    navigateBack: func,
    // Action dispatched when the user searches for a tag
    refreshProducts: func.isRequired,
    // Shop properties, used to get all available tags
    shop: shopShape.isRequired,
  }

  constructor(props) {
    super(props);

    this.loadProducts = this.loadProducts.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderTagRow = this.renderTagRow.bind(this);

    this.state = {
      tagFilter: '',
    }
  }

  onCancel() {
    const { navigateBack } = this.props;

    navigateBack();
  }

  onFilterChange(text) {
    this.setState({ tagFilter: text, selectedTag: null, submitted: false });
  }

  onSubmit() {
    const { shop: { tags } } = this.props;
    const { tagFilter } = this.state;

    const newState = { selectedTag: tagFilter, submitted: false };
    this.setState(newState, () => this.loadProducts());
  }

  renderSearchField() {
    const { tagFilter } = this.state;

    return (
      <View styleName="horizontal sm-gutter-top sm-gutter-horizontal v-center">
        <SearchField
          placeholder={I18n.t(ext('itemSearchPlaceholder'))}
          onChangeText={this.onFilterChange}
          onSubmitEditing={this.onSubmit}
          value={tagFilter}
        />
        {renderCancelButton(this.onCancel)}
      </View>
    );
  }

  selectTag(tag) {
    const newState = { selectedTag: tag, tagFilter: tag, submitted: false };

    this.setState(newState, () => this.loadProducts());
  }

  loadProducts() {
    const { refreshProducts } = this.props;
    const { selectedTag } = this.state;

    refreshProducts(undefined, selectedTag);
  }

  renderTagRow(tag) {
    return (
      <TouchableOpacity onPress={() => this.selectTag(tag)}>
        <Row><Text>{tag}</Text></Row>
      </TouchableOpacity>
    );
  }

  autocompleteTagList(tags, tagFilter) {
    const tagNames = Object.getOwnPropertyNames(tags);
    const matchingTags = tagNames.filter(tag => tag.startsWith(tagFilter));

    return matchingTags || [];
  }

  renderTagSuggestions() {
    const { tags } = this.props;
    const { tagFilter } = this.state;

    return tags ? (
      <ListView
        data={this.autocompleteTagList(tags, tagFilter)}
        renderRow={this.renderTagRow}
      />
    ) : null;
  }

  render() {
    const { tagFilter, selectedTag, submitted } = this.state;

    if (submitted && !selectedTag) {
      const message = `${I18n.t(ext('noItemsWithSpecificTag'))} "${tagFilter}"`;

      return (
        <Screen styleName="paper">
          <NavigationBar />
          {this.renderSearchField()}
          <EmptyStateView icon="search" message={message} />
        </Screen>
      );
    }

    return (
      <Screen styleName="paper">
        <NavigationBar />
        {this.renderSearchField()}
        {(!!tagFilter && !selectedTag) ? this.renderTagSuggestions() : null}
        {!!selectedTag && <ProductsList tag={selectedTag} />}
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const { shop, tags } = state[ext()];

  return {
    shop,
    tags,
  };
};

export default connect(mapStateToProps, { navigateBack, refreshProducts })(
  connectStyle(ext('SearchProductsScreen'))(SearchProductsScreen),
);
