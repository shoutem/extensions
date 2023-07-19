import React, { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen, Spinner } from '@shoutem/ui';
import { getUser } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { HeaderBackButton, navigateTo } from 'shoutem.navigation';
import { ext, NON_EDITABLE_FIELDS } from '../const';
import { Form } from '../form-builder';
import { getUserProfileSchema, submitUserProfile } from '../redux';
import { handleError, remapImageStringToArray } from '../services';

function EditProfileScreen({ navigation, route, style }) {
  const {
    params: {
      canGoBack = true,
      onCancel,
      onSubmitSuccess,
      shouldOpenCompletedScreen = false,
    },
  } = route;

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const user = useSelector(getUser);

  const userProfileSchema = useSelector(state =>
    getUserProfileSchema(state, NON_EDITABLE_FIELDS),
  );

  const resolvedUserProfile = remapImageStringToArray(
    user.profile,
    userProfileSchema,
  );

  useLayoutEffect(
    () =>
      navigation.setOptions({
        title: I18n.t(ext('editUserProfileTitle')),
        headerLeft: props =>
          canGoBack ? <HeaderBackButton {...props} onPress={onCancel} /> : null,
      }),
    [canGoBack, navigation, onCancel],
  );

  function handleSubmit(formValues) {
    setLoading(true);

    return dispatch(submitUserProfile(formValues, userProfileSchema))
      .then(() => {
        if (shouldOpenCompletedScreen) {
          return navigateTo(ext('SubmissionCompletedScreen'), {
            onSubmitSuccess,
          });
        }

        return onSubmitSuccess();
      })
      .catch(handleError)
      .finally(() => setLoading(false));
  }

  return (
    <Screen style={style.container}>
      <Form
        containerStyle={style.padding}
        initialValues={resolvedUserProfile}
        schema={userProfileSchema}
        onSubmit={handleSubmit}
      />
      {loading && <Spinner style={style.padding} />}
    </Screen>
  );
}

EditProfileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      onSubmitSuccess: PropTypes.func.isRequired,
      canGoBack: PropTypes.bool,
      shouldOpenCompletedScreen: PropTypes.bool,
      onCancel: PropTypes.func,
    }).isRequired,
  }).isRequired,
  style: PropTypes.object,
};

EditProfileScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('EditProfileScreen'))(EditProfileScreen);
