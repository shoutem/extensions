import React, { useCallback, useLayoutEffect } from 'react';
import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Screen, Text, View } from '@shoutem/ui';
import { loginRequired } from 'shoutem.auth';
import { logout } from 'shoutem.auth/redux';
import { I18n } from 'shoutem.i18n';
import { HeaderTextButton, navigateTo } from 'shoutem.navigation';
import { ProfileImage, ProfileTextItem } from '../components';
import { ext } from '../const';
import { getGingerProfile } from '../redux';

function MyProfileScreen({ navigation, route, style }) {
  const dispatch = useDispatch();

  const {
    image,
    firstName,
    lastName,
    nick,
    phone,
    birthday,
    addresses,
    defaultAddress,
  } = useSelector(getGingerProfile);

  const profileData = [
    { phone },
    { birthday },
    { address: _.get(addresses, [defaultAddress, 'address']) },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: _.toUpper(_.get(route, 'params.shortcut.title', '')),
      headerRight: () => (
        <HeaderTextButton
          title={I18n.t(ext('editProfileHeaderText'))}
          onPress={() => navigateTo(ext('EditProfileScreen'))}
          tintColor={style.headerButton}
        />
      ),
    });
  }, [navigation, route, style.headerButton]);

  const handleLogoutActionPress = useCallback(() => dispatch(logout()), [
    dispatch,
  ]);

  function renderItem({ item }) {
    const label = Object.keys(item)[0];
    const value = item[label];

    return <ProfileTextItem label={label} value={value} />;
  }

  return (
    <Screen style={style.container}>
      <View styleName="flexible">
        <ProfileImage uri={image} />
        <View styleName="vertical h-center" style={style.mainContainer}>
          <Text>{`${firstName} ${lastName}`}</Text>
          <Text>{nick}</Text>
        </View>
        <FlatList data={profileData} renderItem={renderItem} />
      </View>
      <Button style={style.logoutButton} onPress={handleLogoutActionPress}>
        <Text>{I18n.t(ext('logout'))}</Text>
      </Button>
    </Screen>
  );
}

MyProfileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  style: PropTypes.object,
};

MyProfileScreen.defaultProps = {
  style: {},
};

export default loginRequired(
  connectStyle(ext('MyProfileScreen'))(MyProfileScreen),
);
