import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen, ScrollView } from '@shoutem/ui';
import { getUser } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { goBack, HeaderTextButton, navigateTo } from 'shoutem.navigation';
import { BaseUserProfile } from '../components';
import { ext, PROFILE_HEADER_FIELDS } from '../const';
import { DataPreview } from '../form-builder';
import { getUserProfileSchema, isUserProfileOwner } from '../redux';

function UserProfileScreen({ navigation, route, style }) {
  const {
    params: { user: passedUser },
  } = route;

  const userProfileSchema = useSelector(state =>
    getUserProfileSchema(state, PROFILE_HEADER_FIELDS),
  );

  const isProfileOwner = useSelector(state =>
    isUserProfileOwner(state, passedUser),
  );
  // This has to be calculated for this screen to be in sync after editing own profile
  // If user prop is passed via some onPress callback, it'll not update after edit
  const ownUser = useSelector(getUser);
  const user = useMemo(() => (isProfileOwner ? ownUser : passedUser), [
    isProfileOwner,
    ownUser,
    passedUser,
  ]);

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
        title: I18n.t(ext('userProfileScreenTitle')),
        headerRight: props =>
          isProfileOwner && (
            <HeaderTextButton
              {...props}
              title={I18n.t(ext('editButtonText'))}
              onPress={openEditProfileScreen}
            />
          ),
      }),
    [isProfileOwner, navigation, openEditProfileScreen],
  );

  return (
    <Screen styleName="md-gutter" style={style.screen}>
      <ScrollView style={style.container}>
        <BaseUserProfile user={user} />
        <DataPreview
          values={user.profile}
          schema={userProfileSchema}
          hideEmptyFields={!isProfileOwner}
        />
      </ScrollView>
    </Screen>
  );
}

UserProfileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      user: PropTypes.object.isRequired,
    }),
  }).isRequired,
  style: PropTypes.object,
};

UserProfileScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('UserProfileScreen'))(UserProfileScreen);
