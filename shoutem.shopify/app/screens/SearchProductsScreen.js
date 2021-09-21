import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import { I18n } from 'shoutem.i18n';
import { goBack } from 'shoutem.navigation';
import ProductsList from '../components/ProductsList';
import { shop as shopShape } from '../components/shapes';
import { refreshProducts } from '../redux/actionCreators';
import { ext } from '../const';

const renderCancelButton = onPress => (
  <Button styleName="clear" onPress={onPress}>
    <Subtitle>{I18n.t(ext('cancelSearchButton'))}</Subtitle>
  </Button>
);

export class SearchProductsScreen extends PureComponent {
  static propTypes = {
    // Action dispatched when the user searches for a tag
    refreshProducts: PropTypes.func.isRequired,
    // Shop properties, used to get all available tags
    shop: shopShape.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      tagFilter: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({ title: '' });
  }

  onCancel() {
    goBack();
  }

  onFilterChange(text) {
    this.setState({ tagFilter: text, selectedTag: null, submitted: false });
  }

  onSubmit() {
    const { tagFilter } = this.state;

    const newState = { selectedTag: tagFilter, submitted: false };

    if (tagFilter) {
      this.setState(newState, () => this.loadProducts());
    }

    this.setState(newState, () => refreshProducts());
  }

  renderSearchField() {
    const { tagFilter } = this.state;

    return (
      <View styleName="horizontal sm-gutter-vertical sm-gutter-horizontal v-center">
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
        <Row>
          <Text>{tag}</Text>
        </Row>
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
        ListEmptyComponent={() => null}
      />
    ) : null;
  }

  render() {
    const { tagFilter, selectedTag, submitted } = this.state;

    if (submitted && !selectedTag) {
      const message = `${I18n.t(ext('noItemsWithSpecificTag'))} "${tagFilter}"`;

      return (
        <Screen styleName="paper">
          {this.renderSearchField()}
          <EmptyStateView icon="search" message={message} />
        </Screen>
      );
    }

    return (
      <Screen styleName="paper">
        {this.renderSearchField()}
        {!!tagFilter && !selectedTag ? this.renderTagSuggestions() : null}
        {!!selectedTag && <ProductsList tag={selectedTag} />}
      </Screen>
    );
  }
}

export function mapStateToProps(state) {
  const { shop, tags } = state[ext()];

  return {
    shop,
    tags,
  };
}

export const mapDispatchToProps = { refreshProducts };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('SearchProductsScreen'))(SearchProductsScreen));
