import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Pressable, SectionList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { EmptyListImage, Icon, Screen, Spinner, Text, View } from '@shoutem/ui';
import { loginRequired } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { HeaderIconButton, navigateTo } from 'shoutem.navigation';
import { ext } from '../const';
import { actions, selectors } from '../redux';

function formatAddress(address) {
  return address
    ? `${address.address1}, ${address.city}, ${address.countryCodeV2}`
    : '';
}

export function CustomerAddressScreen({ navigation, style }) {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectors.isLoggedIn);
  const loading = useSelector(selectors.getCustomerLoading);
  const { defaultAddress, addresses } = useSelector(
    selectors.getCustomerAddresses,
  );
  const [refreshing, setRefreshing] = useState(false);

  const sections = useMemo(
    () =>
      !_.isEmpty(defaultAddress) || !_.isEmpty(addresses)
        ? [
            {
              key: I18n.t(ext('defaultAddress')),
              data: defaultAddress,
            },
            {
              key: I18n.t(ext('otherAddresses')),
              data: addresses,
            },
          ]
        : [],
    [defaultAddress, addresses],
  );

  const handleEditAddressPress = useCallback(
    (addressId, section) => {
      navigateTo(ext('EditAddressScreen'), {
        addressId,
        isDefaultAddress: section === sections[0],
      });
    },
    [sections],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: navProps => {
        return (
          <HeaderIconButton
            iconName="plus-button"
            onPress={() => navigateTo(ext('EditAddressScreen'))}
            {...navProps}
          />
        );
      },
    });
  }, [navigation]);

  const renderItem = useCallback(
    ({ item, _index, section }) => (
      <Pressable
        style={style.itemRow}
        key={item.id}
        onPress={() => handleEditAddressPress(item.id, section)}
      >
        <View style={style.itemContainer}>
          <Text style={style.item}>{formatAddress(item)}</Text>
        </View>
        <Icon fill={style.iconFill} name="right-arrow" />
      </Pressable>
    ),
    [style, handleEditAddressPress],
  );

  const renderSectionHeader = useCallback(
    ({ section }) =>
      section.data.length > 0 ? (
        <Text style={style.sectionHeader}>{section.key}</Text>
      ) : null,
    [style.sectionHeader],
  );

  const loadNextAddresses = useCallback(
    () => dispatch(actions.loadNextAddresses()),
    [dispatch],
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    if (isLoggedIn) {
      dispatch(actions.getCustomer());
    }

    setRefreshing(false);
  }, [dispatch, isLoggedIn]);

  const renderListEmptyComponent = useMemo(() => {
    if (!loading) {
      return (
        <EmptyListImage
          message={I18n.t(ext('emptyAddressMessage'))}
          onRetry={handleRefresh}
        />
      );
    }

    return null;
  }, [handleRefresh, loading]);

  return (
    <Screen style={style.screen}>
      {loading && <Spinner style={style.spinner} />}
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={style.container}
        ItemSeparatorComponent={() => <View style={style.divider} />}
        onEndReached={loadNextAddresses}
        stickySectionHeadersEnabled={false}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListEmptyComponent={renderListEmptyComponent}
      />
    </Screen>
  );
}

CustomerAddressScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
};

export default loginRequired(
  connectStyle(ext('CustomerAddressScreen'))(CustomerAddressScreen),
);
