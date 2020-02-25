import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Divider,
  DropDownMenu,
  Image,
  ListView,
  NumberInput,
  Screen,
  ScrollView,
  Title,
  Subtitle,
  View,
  Text,
} from '@shoutem/ui';

import { I18n } from 'shoutem.i18n';
import { NavigationBar } from 'shoutem.navigation';

import {
  product as productShape,
  shop as shopShape,
  variant as variantShape,
} from '../components/shapes';
import { ext } from '../const';

const { func, number, oneOf } = PropTypes;

/*
 * Action types used to determine the context for which
 * this component is called and whether it should show
 * and Add to cart or Update and Remove buttons
 */
const actionTypes = {
  add: 'ADD',
  remove: 'REMOVE',
  update: 'UPDATE',
};

/**
 * Gets values available for selection based on available
 * variants and option. For example, if we only have
 * Small merino wool sweaters, we won't show Medium or
 * Large when the user has selected merino wool.
 */
const getAvailableValuesForOption = (availableVariants, option) => {
  const availableValues = [];

  _.forEach(availableVariants, (variant) => {
    _.forEach(variant.selectedOptions, (variantOption) => {
      if (option.name === variantOption.name) {
        availableValues.push(variantOption);
      }
    });
  });

  console.log("getAvailableValuesForOption returns:", _.uniqBy(availableValues, 'value'));

  return _.uniqBy(availableValues, 'value');
};

/**
 * Filters available variants based on last selected option.
 * For example, we have Massimo Dutti and John Smedley
 * sweaters, but for the latter we only have Small and
 * Medium in Navy. Initially all variants are available.
 * When the user selects John Smedley and Navy, we filter
 * variants to only 2 items: Small and Medium in Navy from
 * this brand.
 */
const getAvailableVariants = (availableVariants, lastSelectedOption) => {
  return _.filter(availableVariants, (variant) => {
    return _.some(variant.selectedOptions, { 'value': lastSelectedOption });
  });
};

/**
 * Returns first available variant for a product or the
 * first variant if none are available.
 */
const getFirstAvailableVariant = item =>
  _.find(item.variants, 'availableForSale') || item.variants[0];

/**
 * Gets values uniquely identifying a variant, for example a
 * Navy wool sweater. Each variant has a list of options that
 * uniquely defines it. For a Navy wool sweater, these
 * options are of the form:
 * [{name: 'color', value: 'Navy'}, {name: 'material', value: 'wool'}}]
 */
const getValuesForVariant = (variant) => {
  return _.reduce(variant.selectedOptions, (result, option) => {
    return _.merge({}, result, { [option.name]: option.value });
  }, {});
};

/**
 * Gets variant and quantity for initial state based on props
 */
const getInitialStateFromProps = (props) => {
  const { item, variant, quantity } = props;

  return {
    variant: variant || getFirstAvailableVariant(item),
    quantity: quantity || 1,
  };
};

/**
 * A component that lets the user update the variant and
 * quantity for a product. When adding a product to the
 * cart, the user can select one of the available variants.
 * When the product is already in the cart, the user can
 * update the quantity, select a new variant, or remove
 * the product from the cart.
 *
 * This component handles all the logic that lets the
 * user select only available variants.
 */
class UpdateItemScreen extends PureComponent {
  static actionTypes = actionTypes;

  /* eslint-disable react/no-unused-prop-types */
  static propTypes = {
    // Sets the context for which this component is called,
    // whether the item is added for the first time, or an
    // existing item is updated
    actionType: oneOf(_.values(actionTypes)),
    // The product for which one of its variants is being
    // added, updated or removed
    item: productShape,
    // Callback executed when the item is added, updated or
    // deleted after the user has done some editing
    onActionButtonClicked: func.isRequired,
    // Initial quantity
    quantity: number,
    // Shop details
    shop: shopShape.isRequired,
    // Initial product variant
    variant: variantShape,
  };

  constructor(props) {
    super(props);

    this.onOptionSelected = this.onOptionSelected.bind(this);
    this.renderOptionRow = this.renderOptionRow.bind(this);

    this.state = getInitialStateFromProps(props);
  }

  /**
   * Selects a new variant matching selected options.
   * If there is no such variant, resets all options
   * below and selects the first available variant.
   */
  onOptionSelected(option) {
    const product = this.props.item;
    const oldVariant = this.state.variant;

    const selectedValues = getValuesForVariant(oldVariant);

    selectedValues[option.name] = option.value;

    let newVariant = _.find(product.variants, (variant) => {
      return _.isEqual(getValuesForVariant(variant), selectedValues);
    });

    if (!newVariant) {
      const optionIndex = _.findIndex(product.options, { 'name': option.name });
      const optionValuesToSelect =
        _.map(product.options.slice(0, optionIndex + 1), (option) => {
          return { name: option.name, value: selectedValues[option.name] };
        });

      newVariant = _.find(product.variants, (variant) => {
        const valuesForVariant = getValuesForVariant(variant);

        return _.every(optionValuesToSelect, option =>
              option.value === valuesForVariant[option.name]);
      });
    }
    this.setState({ variant: newVariant || product.variants[0] });
  }

  /**
   * For each option, selects value based on
   * selected variant and filters available
   * variants based on this value. This ensures
   * that the user can only choose a set of
   * options for which there are existing variants.
   */
  getAvailableOptions() {
    const { item } = this.props;
    const { variant } = this.state;

    // if there is only one variant, it is already selected, so we don't render
    if (_.size(item.variants) === 1) {
      return null;
    }

    const availableOptions = [];
    let availableVariants = item.variants;

    _.forEach(item.options, (option) => {
      const availableValues =
        getAvailableValuesForOption(availableVariants, option);

      availableOptions.push({
        optionName: option.name,
        values: availableValues,
      });

      const lastSelectedOption = _.find(
        variant.selectedOptions, { 'name': option.name }
      ).value;
    });

    return availableOptions;
  }

  renderAddToCartButton() {
    const { onActionButtonClicked } = this.props;
    const { variant, quantity } = this.state;
    const { availableForSale } = variant;

    const { add } = actionTypes;

    const canUpdate = availableForSale && quantity;
    const resolvedStyleName =
      `horizontal h-end md-gutter ${canUpdate ? '' : 'muted'}`

    return (
      <View styleName={resolvedStyleName}>
        <Button
          styleName="secondary"
          onPress={() => canUpdate &&
            onActionButtonClicked(add, { variant, quantity })
          }
        >
          <Text styleName="bold lg-gutter-horizontal">
            {I18n.t(ext('addItemConfirmButton'))}
          </Text>
        </Button>
      </View>
    );
  }

  renderUpdateButtons() {
    const { onActionButtonClicked } = this.props;
    const { variant, quantity } = this.state;
    const { availableForSale } = variant;

    const { remove, update } = actionTypes;

    const canUpdate = availableForSale && quantity;
    const resolvedStyleName =
      `horizontal md-gutter-vertical ${canUpdate ? '' : 'muted'}`

    return (
      <View styleName={resolvedStyleName}>
        <Button
          styleName="confirmation"
          onPress={() => onActionButtonClicked(remove)}
        >
          <Text>{I18n.t(ext('cartItemRemoveButton'))}</Text>
        </Button>
        <Button
          styleName="confirmation secondary"
          onPress={() => canUpdate &&
            onActionButtonClicked(update, { variant, quantity })
          }
        >
          <Text>{I18n.t(ext('cartItemUpdateButton'))}</Text>
        </Button>
      </View>
    );
  }

  renderItemDetails() {
    const { variant } = this.state;
    const { item, shop } = this.props;

    const { price, compare_at_price: oldPrice } = variant;
    const { images, title } = item;
    const { currency } = shop;

    return (
      <View styleName="horizontal solid v-start md-gutter">
        <Image
          styleName="small"
          source={{ uri: (images[0] || {}).src }}
        />
        <View style={{ flex: 7 }} styleName="md-gutter-left">
          <Subtitle>{title}</Subtitle>
        </View>
        <View styleName="h-end sm-gutter-left vertical" style={{ flex: 3 }}>
          {(oldPrice && oldPrice < price) &&
            <Caption styleName="line-through">
              {currency}{oldPrice}
            </Caption>
          }
          <Subtitle>{currency}{price}</Subtitle>
        </View>
      </View>
    );
  }

  renderQuantityPicker() {
    const { quantity, variant: { availableForSale } } = this.state;

    const viewStyling = 'horizontal v-center space-between'
      + ' md-gutter-horizontal lg-gutter-vertical';

    return (
      <View styleName={viewStyling} >
        <Subtitle>{I18n.t(ext('itemQuantity'))}</Subtitle>
        {availableForSale ?
          <NumberInput
            min={1}
            onChange={quantity => this.setState({ quantity })}
            step={1}
            value={quantity}
          /> :
          <Subtitle styleName="muted">
            {I18n.t(ext('outOfStockMessage'))}
          </Subtitle>
        }
      </View>
    );
  }

  renderStatusRow() {
    const { shop: { currency } } = this.props;
    const { variant, quantity } = this.state;

    const { availableForSale, price } = variant;
    const canUpdate = availableForSale && quantity;
    const resolvedStyleName =
      `horizontal md-gutter space-between ${canUpdate ? '' : 'muted'}`

    return (
      <View styleName={resolvedStyleName}>
        <Subtitle>{I18n.t(ext('updateItemScreenProductPrice'))}</Subtitle>
        <Subtitle>{`${currency}${(price * quantity).toFixed(2)}`}</Subtitle>
      </View>
    );
  }

  renderOptionRow({ values, optionName }) {
    const { variant } = this.state;

    const option = _.find(variant.selectedOptions, { 'name': optionName });
    const selectedOption = _.find(values, { 'value': option.value });
    const viewStyling = 'horizontal v-center space-between'
      + ' md-gutter-horizontal lg-gutter-vertical';

    return (
      <View>
        <View styleName={viewStyling}>
          <Subtitle>{optionName}</Subtitle>
          {_.size(values) === 1 ?
            <Subtitle>{values[0].value}</Subtitle> :
            <DropDownMenu
              onOptionSelected={this.onOptionSelected}
              options={values}
              selectedOption={selectedOption}
              styleName="large"
              titleProperty={'value'}
              valueProperty={'value'}
            />
          }
        </View>
        <Divider styleName="line" />
      </View>
    );
  }

  render() {
    const { actionType } = this.props;

    console.log("UpdateItemScreen");
    console.log("this.props:", this.props);
    console.log("this.state:", this.state);

    const { add } = actionTypes;

    return (
      <Screen>
        <NavigationBar title={I18n.t(ext('addToCartNavBarTitle'))} />
        <ScrollView>
          {this.renderItemDetails()}
          <Divider styleName="line" />
          <ListView
            data={this.getAvailableOptions()}
            renderRow={this.renderOptionRow}
          />
          {this.renderQuantityPicker()}
        </ScrollView>
        <Divider styleName="line" />
        {this.renderStatusRow()}
        {actionType === add ?
          this.renderAddToCartButton() :
          this.renderUpdateButtons()
        }
      </Screen>
    );
  }
}

export const mapStateToProps = (state) => {
  const { shop } = state[ext()];

  return {
    shop,
  };
};

export default connect(mapStateToProps, {})(
  connectStyle(ext('UpdateItemScreen'))(UpdateItemScreen),
);
