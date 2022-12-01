import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, LayoutAnimation, Modal, Pressable } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Text, Toast } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';
import {
  getFirstAvailableVariant,
  getProductImage,
  getSellableProductOptions,
  getValuesForVariant,
} from '../../services';
import { product as productShape } from '../shapes';
import QuantitySelector from './QuantitySelector';
import QuickAddItemDetails from './QuickAddItemDetails';
import QuickAddOption from './QuickAddOption';
import QuickAddTitle from './QuickAddTitle';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function QuickAddModal({ visible, onCancel, style, product, onSubmit }) {
  const appearAnimationValue = useRef(new Animated.Value(0)).current;
  const [selectedVariant, selectVariant] = useState(undefined);
  const [height, setHeight] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      const variant = getFirstAvailableVariant(product);

      selectVariant(variant);
      return;
    }

    selectVariant(undefined);
  }, [product]);

  const handleContentLayout = useCallback(event => {
    const { height } = event.nativeEvent.layout;
    setHeight(height);
  }, []);

  function handleCancel() {
    const callback = () => {
      setQuantity(1);
      onCancel();
    };

    animateDisappear(callback);
  }

  function handleAddToCartPress() {
    const callback = () => {
      onSubmit(selectedVariant, quantity);
      Toast.showInfo({
        title: I18n.t(ext('quickAddToastTitleProductAdded')),
        message: `${quantity} x ${product.title}`,
        iconSource: leadingImage,
      });
      setQuantity(1);
    };

    animateDisappear(callback);
  }

  function handleOptionValueSelected(optionValue) {
    const newVariantValues = getValuesForVariant(selectedVariant);
    newVariantValues[optionValue.name] = optionValue.value;

    const newVariant = _.find(product.variants, variant =>
      _.isEqual(getValuesForVariant(variant), newVariantValues),
    );

    LayoutAnimation.easeInEaseOut();
    selectVariant(newVariant);
  }

  const getSelectedOptionValue = useCallback(
    optionName =>
      _.find(
        selectedVariant?.selectedOptions,
        option => option.name === optionName,
      )?.value,
    [selectedVariant],
  );

  const animateAppear = () => {
    Animated.timing(appearAnimationValue, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const animateDisappear = callback => {
    Animated.timing(appearAnimationValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(callback);
  };

  const productOptions = product ? getSellableProductOptions(product) : {};
  const leadingImage = getProductImage(product?.images);

  return (
    <Modal visible={visible} transparent onShow={animateAppear}>
      <AnimatedPressable
        onPress={handleCancel}
        style={[
          style.container,
          {
            opacity: appearAnimationValue.interpolate({
              inputRange: [0, 0.5],
              outputRange: [0, 1],
            }),
          },
        ]}
      >
        <AnimatedPressable
          onLayout={handleContentLayout}
          onPress={null}
          style={[
            style.contentContainer,
            {
              transform: [
                {
                  translateY: appearAnimationValue.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0, -height],
                  }),
                },
              ],
            },
          ]}
        >
          <QuickAddTitle onPress={handleCancel} title={product?.title} />
          <QuickAddItemDetails
            image={leadingImage}
            description={product?.description}
            variant={selectedVariant}
            quantity={quantity}
          />
          <QuantitySelector onCountChange={setQuantity} />
          {_.map(productOptions, option => (
            <QuickAddOption
              key={option.name}
              option={option}
              selectedValue={getSelectedOptionValue(option.name)}
              onValueSelected={handleOptionValueSelected}
            />
          ))}
          <Button style={style.confirmButton} onPress={handleAddToCartPress}>
            <Text style={style.confirmButtonText}>
              {I18n.t(ext('quickBuyAddToCartButton'))}
            </Text>
          </Button>
        </AnimatedPressable>
      </AnimatedPressable>
    </Modal>
  );
}

QuickAddModal.propTypes = {
  style: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  product: productShape,
  visible: PropTypes.bool,
};

QuickAddModal.defaultProps = {
  visible: false,
  product: undefined,
};

export default connectStyle(ext('QuickAddModal'))(QuickAddModal);
