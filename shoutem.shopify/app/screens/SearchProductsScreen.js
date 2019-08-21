import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Platform } from 'react-native';
import _ from 'lodash';

import {
  Button,
  EmptyStateView,
  ListView,
  Row,
  Text,
  TouchableOpacity,
  Screen,
  SearchField,
  Subtitle,
  View,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';
import { NavigationBar, navigateBack } from 'shoutem.navigation';

import { refreshProducts } from '../redux/actionCreators';
import { shop as shopShape } from '../components/shapes';
import ProductsList from '../components/ProductsList';
import { ext } from '../const';

const { func } = PropTypes;

const renderCancelButton = onPress => (
  <Button
    styleName="clear"
    onPress={onPress}
  >
    <Subtitle>{I18n.t(ext('cancel'))}</Subtitle>
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
    this.renderNoTagFound = this.renderNoTagFound.bind(this);
    this.handleRetry = this.handleRetry.bind(this);

    this.state = {};
  }

  onCancel() {
    const { navigateBack } = this.props;

    navigateBack();
  }

  onSubmit() {
    const { tags } = this.props.shop;
    const { tagFilter } = this.state;

    // When the user submits a search without selecting a tag, we
    // try to find it in the list
    const matchingTag = _.includes(tags, tagFilter) ? tagFilter : null;

    this.setState({ selectedTag: matchingTag, submitted: true });
  }

  onFilterChange(text) {
    this.setState({ tagFilter: text, selectedTag: null, submitted: false });
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

  handleRetry() {
    this.onFilterChange('');
  }

  renderNoTagFound(tag) {
    const message = I18n.t(ext('noItemsWithSpecificTag'), { unmatchedTag: tag });

    return (
      <EmptyStateView
        icon="search"
        message={message}
        onRetry={this.handleRetry}
        retryButtonTitle={I18n.t(ext('ok'))}
      />
    );
  }

  renderSearchField() {
    const { tagFilter } = this.state;

    const topGutter = Platform.OS === 'android' ? 'sm-gutter-top' : 'lg-gutter-top';

    return (
      <View
        styleName={`horizontal ${topGutter} md-gutter-left sm-gutter-right v-center`}
      >
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

  renderTagRow(tag) {
    return (
      <TouchableOpacity onPress={() => this.selectTag(tag)}>
        <Row><Text>{tag}</Text></Row>
      </TouchableOpacity>
    );
  }

  renderTagSuggestions() {
    const { shop } = this.props;
    const { tags } = shop;
    const { tagFilter } = this.state;

    return (
      <ListView
        data={_.filter(tags, tag => tag.startsWith(tagFilter))}
        renderRow={this.renderTagRow}
      />
    );
  }

  render() {
    const { tagFilter, selectedTag, submitted } = this.state;

    if (submitted && !selectedTag) {
      return this.renderNoTagFound(tagFilter);
    }

    return (
      <Screen styleName="paper">
        <NavigationBar hidden />
        {this.renderSearchField()}
        {tagFilter && !selectedTag ? this.renderTagSuggestions() : null}
        {selectedTag ? <ProductsList tag={selectedTag} /> : null}
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const { shop } = state[ext()];

  return {
    shop,
  };
};

export default connect(mapStateToProps, { navigateBack, refreshProducts })(
  connectStyle(ext('SearchProductsScreen'))(SearchProductsScreen),
);
