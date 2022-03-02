import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle, getSizeRelativeToReference } from '@shoutem/theme';
import { Icon, Image, Screen, ScrollView, Text, View } from '@shoutem/ui';
import { authenticate } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { CartIcon, LoadingButton, QuantitySelector } from '../components';
import { ext, LOW_QUANTITY_MAX_SIZE } from '../const';
import { addToCart } from '../redux';
import { getProductPrice, getProductSubtitle } from '../services';

const window = Dimensions.get('window');
const IMAGE_WIDTH = getSizeRelativeToReference(200, 375, window.width);
const CAROUSEL_WIDTH = getSizeRelativeToReference(250, 375, window.width);

function ProductDetailsScreen(props) {
  const dispatch = useDispatch();

  const [count, setCount] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);

  const { navigation, style } = props;
  const { product } = getRouteParams(props);

  const hasLowQuantity = product.quantity <= LOW_QUANTITY_MAX_SIZE;

  useEffect(() => {
    navigation.setOptions({
      ...composeNavigationStyles(['noBorder']),
      headerRight: props => <CartIcon {...props} />,
    });
  }, [navigation]);

  function renderImage({ item }) {
    return <Image source={{ uri: item }} style={style.image} />;
  }

  const handleAddToCartPress = useCallback(() => {
    return new Promise((resolve, reject) => {
      dispatch(
        authenticate(
          () =>
            dispatch(addToCart(product.skuId, count))
              .then(resolve)
              .catch(reject),
          reject,
        ),
      );
    });
  }, [count, dispatch, product]);

  return (
    <Screen styleName="paper">
      <ScrollView
        contentContainerStyle={style.container}
        stickyHeaderIndices={[1]}
      >
        <View styleName="vertical h-center">
          <Carousel
            data={product.images}
            renderItem={renderImage}
            sliderWidth={CAROUSEL_WIDTH}
            itemWidth={IMAGE_WIDTH}
            removeClippedSubviews={false}
            autoplay
            loop
            lockScrollWhileSnapping
            onSnapToItem={setActiveSlide}
          />
          <Pagination
            dotsLength={product.images.length}
            activeDotIndex={activeSlide}
            containerStyle={style.paginationContainer}
            dotContainerStyle={style.paginationDotContainer}
            dotStyle={style.paginationDot}
            inactiveDotStyle={style.paginationDot}
            inactiveDotOpacity={0.5}
            inactiveDotScale={0.8}
          />
          <Text style={style.title}>{product.name}</Text>
          <Text style={style.subtitle}>{getProductSubtitle(product)}</Text>
          <Text style={style.price}>{getProductPrice(product, count)}</Text>
          {hasLowQuantity && (
            <View styleName="horizontal v-center">
              <Icon name="ginger-clock" style={style.quantityIcon} />
              <Text style={style.subtitle}>
                {I18n.t(ext('productDetailsLowInStock'))}
              </Text>
            </View>
          )}
        </View>
        <View styleName="horizontal flexible solid md-gutter-bottom">
          <QuantitySelector count={count} onCountChange={setCount} />
          <LoadingButton
            label={I18n.t(ext('addToCart'))}
            containerStyle={style.button}
            textStyle={style.buttonText}
            onPress={handleAddToCartPress}
            withSuccessStates
          />
        </View>
        <Text style={style.description}>{product.description}</Text>
      </ScrollView>
    </Screen>
  );
}

ProductDetailsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      product: PropTypes.object,
    }),
  }).isRequired,
  style: PropTypes.object,
};

ProductDetailsScreen.defaultProps = {
  style: {},
};

export default React.memo(
  connectStyle(ext('ProductDetailsScreen'))(ProductDetailsScreen),
);
