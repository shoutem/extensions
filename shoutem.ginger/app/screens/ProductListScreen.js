import React, { useEffect, useState } from 'react';
import { LayoutAnimation } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen, ScrollView } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { goBack, navigateTo } from 'shoutem.navigation';
import { animations, images } from '../assets';
import {
  CartIcon,
  CategoryPicker,
  ConfirmationModal,
  LargeProductListItem,
  PlaceholderView,
} from '../components';
import { ALL_CATEGORY, ext } from '../const';
import {
  addToCart,
  getCategories,
  getCategoryItems,
  isInventoryLoading,
  loadInventory,
  updateCustomerInfo,
} from '../redux';

function ProductListScreen({ navigation, route, style }) {
  const dispatch = useDispatch();
  const categories = useSelector(getCategories);
  const loading = useSelector(isInventoryLoading);

  const [errorModalActive, setErrorModalActive] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const products = useSelector(state =>
    getCategoryItems(state, selectedCategory.id),
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: props => <CartIcon {...props} />,
      title: _.toUpper(_.get(route, 'params.shortcut.title', '')),
    });
  }, [navigation, route]);

  useEffect(() => {
    dispatch(loadInventory());
  }, [dispatch]);

  useEffect(() => LayoutAnimation.easeInEaseOut, [loading]);

  function handleCategorySelected(category) {
    LayoutAnimation.easeInEaseOut();
    setSelectedCategory(category);
  }

  function handleItemPress(product) {
    navigateTo(ext('ProductDetailsScreen'), {
      product,
    });
  }

  function handleBuyPress(skuId) {
    return dispatch(addToCart(skuId, 1)).catch(handleBuyError);
  }

  function handleLocationSelected(data) {
    dispatch(updateCustomerInfo({ addresses: [{ ...data }] })).then(() => {
      goBack();
      dispatch(loadInventory());
    });
  }

  function handleSelectLocationPress() {
    navigateTo(ext('SelectLocationScreen'), {
      onLocationSelected: handleLocationSelected,
    });
  }

  function handleBuyError(error) {
    const resolvedError = _.get(
      error,
      'response.error.messages.type',
      I18n.t(ext('alertTryAgainMessage')),
    );

    setError(resolvedError);
    setErrorModalActive(true);
  }

  if (loading) {
    return <LottieView source={animations.storeLoading} autoPlay loop />;
  }

  if (!loading && _.isEmpty(products)) {
    return (
      <PlaceholderView
        image={images.emptyOrders}
        buttonLabel={I18n.t(ext('productListEmptyStateButton'))}
        onButtonPress={handleSelectLocationPress}
      />
    );
  }

  return (
    <Screen styleName="paper">
      <CategoryPicker
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelected={handleCategorySelected}
      />
      <ScrollView
        contentContainerStyle={style.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {_.map(products, product => (
          <LargeProductListItem
            product={product}
            key={product.skuId}
            onBuyPress={handleBuyPress}
            onPress={handleItemPress}
          />
        ))}
      </ScrollView>
      <ConfirmationModal
        onCancel={() => setErrorModalActive(false)}
        cancelButtonText={I18n.t(ext('productListErrorModalButton'))}
        visible={errorModalActive}
        description={error}
      />
    </Screen>
  );
}

ProductListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  style: PropTypes.object,
};

ProductListScreen.defaultProps = {
  style: {},
};

export default React.memo(
  connectStyle(ext('ProductListScreen'))(ProductListScreen),
);
