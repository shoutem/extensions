import React, {
  Component,
} from 'react';

import { Platform } from 'react-native';

import { connect } from 'react-redux';

import _ from 'lodash';

import {
  Button,
  ListView,
  Row,
  Text,
  TouchableOpacity,
  Screen,
  Subtitle,
  View,
} from '@shoutem/ui';

import { EmptyStateView, SearchField } from '@shoutem/ui-addons';

import { NavigationBar } from '@shoutem/ui/navigation';

import {
  navigateBack,
 } from '@shoutem/core/navigation';

import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';

import { ext } from '../const';
import ProductsList from '../components/ProductsList';
import { shop as shopShape } from '../components/shapes';
import { refreshProducts } from '../redux/actionCreators';

const { func } = React.PropTypes;

const renderCancelButton = onPress => (
  <Button
    styleName="clear"
    onPress={onPress}
  >
    <Subtitle>Cancel</Subtitle>
  </Button>
);

const renderNoTagFound = (tag) => {
  const message = `${I18n.t(ext('noItemsWithSpecificTag'))}"${tag}"`;

  return (
    <EmptyStateView
      icon="search"
      message={message}
    />
  );
};

class SearchProductsScreen extends Component {
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

    this.state = {};
  }

  onCancel() {
    const { navigateBack } = this.props;

    navigateBack();
  }

  onFilterChange(text) {
    this.setState({ tagFilter: text, selectedTag: null, submitted: false });
  }

  onSubmit() {
    const { tags } = this.props.shop;
    const { tagFilter } = this.state;

    // When the user submits a search without selecting a tag, we
    // try to find it in the list
    const matchingTag = _.includes(tags, tagFilter) ? tagFilter : null;

    this.setState({ selectedTag: matchingTag, submitted: true });
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
      return renderNoTagFound(tagFilter);
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
