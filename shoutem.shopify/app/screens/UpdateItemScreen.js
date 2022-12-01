import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  DropDownMenu,
  Image,
  ListView,
  NumberInput,
  Screen,
  ScrollView,
  Subtitle,
  Text,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import { images as localImages } from '../assets';
import { shop as shopShape } from '../components/shapes';
import { ext } from '../const';
import {
  getAvailableValuesForOption,
  getFirstAvailableVariant,
  getValuesForVariant,
} from '../services';

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
 * Gets variant and quantity for initial state based on props
 */
const getInitialStateFromProps = props => {
  const { variant, quantity } = props;
  const { item } = getRouteParams(props);

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

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = getInitialStateFromProps(props);
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({ title: I18n.t(ext('addToCartNavBarTitle')) });
  }

  /**
   * Selects a new variant matching selected options.
   * If there is no such variant, resets all options
   * below and selects the first available variant.
   */
  onOptionSelected(option) {
    const product = _.get(this.props, 'route.params.item', null);
    const { variant: oldVariant } = this.state;

    const selectedValues = getValuesForVariant(oldVariant);

    selectedValues[option.name] = option.value;

    let newVariant = _.find(product?.variants, variant => {
      return _.isEqual(getValuesForVariant(variant), selectedValues);
    });

    if (!newVariant) {
      const optionIndex = _.findIndex(product?.options, { name: option.name });
      const optionValuesToSelect = _.map(
        product?.options.slice(0, optionIndex + 1),
        option => {
          return { name: option.name, value: selectedValues[option.name] };
        },
      );

      newVariant = _.find(product?.variants, variant => {
        const valuesForVariant = getValuesForVariant(variant);

        return _.every(
          optionValuesToSelect,
          option => option.value === valuesForVariant[option.name],
        );
      });
    }
    this.setState({ variant: newVariant || product?.variants[0] });
  }

  /**
   * For each option, selects value based on
   * selected variant and filters available
   * variants based on this value. This ensures
   * that the user can only choose a set of
   * options for which there are existing variants.
   */
  getAvailableOptions() {
    const { item } = getRouteParams(this.props);

    // if there is only one variant, it is already selected, so we don't render
    if (_.size(item.variants) === 1) {
      return null;
    }

    const availableOptions = [];
    const availableVariants = item.variants;

    _.forEach(item.options, option => {
      const availableValues = getAvailableValuesForOption(
        availableVariants,
        option,
      );

      availableOptions.push({
        optionName: option.name,
        values: availableValues,
      });
    });

    return availableOptions;
  }

  handleAdd() {
    const { onActionButtonClicked } = getRouteParams(this.props);
    const { variant, quantity } = this.state;

    const { add } = actionTypes;

    onActionButtonClicked(add, { variant, quantity });
  }

  handleRemove() {
    const { onActionButtonClicked } = getRouteParams(this.props);

    const { remove } = actionTypes;

    onActionButtonClicked(remove);
  }

  handleUpdate() {
    const { onActionButtonClicked } = getRouteParams(this.props);
    const { variant, quantity } = this.state;
    const { availableForSale } = variant;

    const { update } = actionTypes;

    if (availableForSale && quantity) {
      onActionButtonClicked(update, { variant, quantity });
    }
  }

  renderAddToCartButton() {
    const { variant, quantity } = this.state;
    const { availableForSale } = variant;

    const canUpdate = availableForSale && quantity;
    const resolvedStyleName = `horizontal h-end md-gutter ${
      canUpdate ? '' : 'muted'
    }`;

    return (
      <View styleName={resolvedStyleName}>
        <Button disabled={!canUpdate} onPress={this.handleAdd}>
          <Text styleName="bold lg-gutter-horizontal">
            {I18n.t(ext('addItemConfirmButton'))}
          </Text>
        </Button>
      </View>
    );
  }

  renderUpdateButtons() {
    const { variant, quantity } = this.state;
    const { availableForSale } = variant;

    const canUpdate = availableForSale && quantity;
    const resolvedStyleName = `horizontal md-gutter-vertical ${
      canUpdate ? '' : 'muted'
    }`;

    return (
      <View styleName={resolvedStyleName}>
        <Button styleName="confirmation" onPress={this.handleRemove}>
          <Text>{I18n.t(ext('cartItemRemoveButton'))}</Text>
        </Button>
        <Button styleName="confirmation secondary" onPress={this.handleUpdate}>
          <Text>{I18n.t(ext('cartItemUpdateButton'))}</Text>
        </Button>
      </View>
    );
  }

  renderItemDetails() {
    const { variant } = this.state;
    const { shop, style } = this.props;
    const { item } = getRouteParams(this.props);

    const { price, compare_at_price: oldPrice } = variant;
    const { images, title } = item;
    const { currency } = shop;

    const productImage = images[0]
      ? { uri: images[0].url }
      : localImages.fallback;

    return (
      <View style={style.itemDetailsContainer}>
        <Image style={style.image} source={productImage} />
        <View style={style.descriptionContainer}>
          <Subtitle>{title}</Subtitle>
          <View>
            {!!oldPrice && oldPrice < price && (
              <Caption style={style.oldPrice}>
                {currency}
                {oldPrice}
              </Caption>
            )}
            <Subtitle style={style.price}>
              {currency}
              {price}
            </Subtitle>
          </View>
        </View>
      </View>
    );
  }

  renderQuantityPicker() {
    const { style } = this.props;
    const {
      quantity,
      variant: { availableForSale },
    } = this.state;

    return (
      <View style={style.quantityContainer}>
        <Subtitle>{I18n.t(ext('itemQuantity'))}</Subtitle>
        {availableForSale ? (
          <NumberInput
            min={1}
            onChange={quantity => this.setState({ quantity })}
            step={1}
            style={style.numberInput}
            value={quantity}
          />
        ) : (
          <Subtitle styleName="muted">
            {I18n.t(ext('outOfStockMessage'))}
          </Subtitle>
        )}
      </View>
    );
  }

  renderStatusRow() {
    const {
      shop: { currency },
    } = this.props;
    const { variant, quantity } = this.state;

    const { availableForSale, price } = variant;
    const canUpdate = availableForSale && quantity;
    const resolvedStyleName = `horizontal md-gutter space-between ${
      canUpdate ? '' : 'muted'
    }`;

    return (
      <View styleName={resolvedStyleName}>
        <Subtitle>{I18n.t(ext('updateItemScreenProductPrice'))}</Subtitle>
        <Subtitle>{`${currency}${(price * quantity).toFixed(2)}`}</Subtitle>
      </View>
    );
  }

  renderOptionRow({ values, optionName }) {
    const { style } = this.props;
    const { variant } = this.state;

    const option = _.find(variant.selectedOptions, { name: optionName });
    const selectedOption = _.find(values, { value: option.value });

    return (
      <View style={style.optionRow}>
        <Subtitle>{optionName}</Subtitle>
        {_.size(values) === 1 ? (
          <Subtitle>{values[0].value}</Subtitle>
        ) : (
          <DropDownMenu
            onOptionSelected={this.onOptionSelected}
            options={values}
            selectedOption={selectedOption}
            style={style.dropDownMenu}
            styleName="large"
            titleProperty="value"
            valueProperty="value"
          />
        )}
      </View>
    );
  }

  render() {
    const { style } = this.props;
    const { actionType } = getRouteParams(this.props);
    const { add } = actionTypes;

    return (
      <Screen style={style.screen}>
        <ScrollView>
          {this.renderItemDetails()}
          {this.renderQuantityPicker()}
          <ListView
            data={this.getAvailableOptions()}
            contentContainerStyle={style.optionsContainer}
            renderRow={this.renderOptionRow}
            ListEmptyComponent={() => null}
          />
        </ScrollView>
        <View style={style.footer}>
          {this.renderStatusRow()}
          {actionType === add
            ? this.renderAddToCartButton()
            : this.renderUpdateButtons()}
        </View>
      </Screen>
    );
  }
}

UpdateItemScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  shop: shopShape.isRequired,
  style: PropTypes.object.isRequired,
};

export const mapStateToProps = state => {
  const { shop } = state[ext()];

  return {
    shop,
  };
};

export default connect(mapStateToProps)(
  connectStyle(ext('UpdateItemScreen'))(UpdateItemScreen),
);
