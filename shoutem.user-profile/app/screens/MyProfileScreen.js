import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isInitialized } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { Button, Screen, ScrollView, Text } from '@shoutem/ui';
import { getUser, loginRequired } from 'shoutem.auth';
import { logout } from 'shoutem.auth/redux';
import { I18n } from 'shoutem.i18n';
import { goBack, HeaderTextButton, navigateTo } from 'shoutem.navigation';
import { BaseUserProfile } from '../components';
import { ext, PROFILE_HEADER_FIELDS } from '../const';
import { DataPreview } from '../form-builder';
import { getUserProfileSchema } from '../redux';

function MyProfileScreen({ navigation, style }) {
  const dispatch = useDispatch();

  const ownUser = useSelector(getUser);
  const userProfileSchema = useSelector(state =>
    getUserProfileSchema(state, PROFILE_HEADER_FIELDS),
  );

  const showPreview = useMemo(
    () => isInitialized(ownUser) && !!ownUser.profile,
    [ownUser],
  );

  const openEditProfileScreen = useCallback(
    () =>
      navigateTo(ext('EditProfileScreen'), {
        onSubmitSuccess: goBack,
        onCancel: goBack,
      }),
    [],
  );

  useLayoutEffect(
    () =>
      navigation.setOptions({
        title: I18n.t(ext('myProfileScreenTitle')),
        headerRight: props => (
          <HeaderTextButton
            {...props}
            title={I18n.t(ext('editButtonText'))}
            onPress={openEditProfileScreen}
          />
        ),
      }),
    [navigation, openEditProfileScreen],
  );

  function logoutUser() {
    dispatch(logout());
  }

  return (
    <Screen styleName="md-gutter-horizontal">
      {showPreview && (
        <ScrollView contentContainerStyle={style.container}>
          <BaseUserProfile user={ownUser} />
          <DataPreview values={ownUser.profile} schema={userProfileSchema} />
          <Button
            styleName="xl-gutter-vertical xl-gutter-horizontal"
            onPress={logoutUser}
          >
            <Text>{I18n.t(ext('logout'))}</Text>
          </Button>
        </ScrollView>
      )}
    </Screen>
  );
}

MyProfileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object,
};

MyProfileScreen.defaultProps = {
  style: {},
};

export default loginRequired(
  connectStyle(ext('MyProfileScreen'))(MyProfileScreen),
);
