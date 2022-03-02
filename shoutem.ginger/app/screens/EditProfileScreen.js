import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, Keyboard, Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ActionSheet } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { goBack, navigateTo } from 'shoutem.navigation';
import {
  PERMISSION_TYPES,
  requestPermissions,
  RESULTS,
} from 'shoutem.permissions';
import {
  ConfirmationModal,
  DatePicker,
  FormInput,
  FormInputButton,
  KeyboardAwareContainer,
  LoadingButton,
  ProfileImage,
} from '../components';
import { ext } from '../const';
import {
  createCustomer,
  getGingerCustomer,
  getGingerProfile,
  sendVerificationCode,
  setCustomerProfile,
  updateCustomerInfo,
} from '../redux';
import {
  DATE_LABEL_FORMAT,
  DATE_VALUE_FORMAT,
  validateFields,
} from '../services';

const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSION_TYPES.IOS_CAMERA,
  default: PERMISSION_TYPES.ANDROID_CAMERA,
});

const IMAGE_PICKER_OPTIONS = {
  mediaType: 'photo',
  allowsEditing: true,
  includeBase64: true,
  saveToPhotos: false,
  maxHeight: 500,
  maxWidth: 500,
};

function EditProfileScreen({ navigation, style }) {
  const dispatch = useDispatch();

  const profile = useSelector(getGingerCustomer);
  const { image } = useSelector(getGingerProfile);

  const [phoneNumber, setPhoneNumber] = useState(profile.phone);
  const [isPhoneChanged, setIsPhoneChanged] = useState(false);

  const [profilePicture, setProfilePicture] = useState(image);
  const [profilePictureData, setProfilePictureData] = useState(image);
  const [pickerActive, setPickerActive] = useState(false);

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);

  const defaultAddress = _.get(profile, ['addresses', profile.defaultAddress]);
  const [address, setAddress] = useState(defaultAddress.address);
  const [googlePlaceId, setGooglePlaceId] = useState(
    defaultAddress.googlePlaceId,
  );
  const [location, setLocation] = useState(defaultAddress.location);

  const [dob, setDob] = useState(moment(profile.dob).toDate());
  const [dobLabel, setDobLabel] = useState(
    moment(dob).format(DATE_LABEL_FORMAT),
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    I18n.t(ext('alertTryAgainMessage')),
  );
  const [showErrorModal, setShowErrorModal] = useState(false);
  const hideErrorModal = useCallback(() => setShowErrorModal(false), []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: _.toUpper(I18n.t(ext('editProfileNavBarTitle'))),
    });
  });

  const submitDisabled =
    loading ||
    !validateFields({
      phoneNumber,
      firstName,
      lastName,
      address,
      dobLabel,
    });

  const hideImagePicker = useCallback(() => setPickerActive(false), []);

  const handleError = useCallback(e => {
    if (e && _.isString(e)) {
      setErrorMessage(e);
    }
    setShowErrorModal(true);
  }, []);

  function handleGalleryPickerPress() {
    launchImageLibrary(IMAGE_PICKER_OPTIONS, handleImagePickerResponse);
  }

  function handleCameraPickerPress() {
    requestPermissions(CAMERA_PERMISSION).then(result => {
      if (result[CAMERA_PERMISSION] === RESULTS.GRANTED) {
        return launchCamera(IMAGE_PICKER_OPTIONS, handleImagePickerResponse);
      }

      return null;
    });
  }

  const pickerOptions = [
    {
      title: I18n.t(ext('imagePickerCameraOption')),
      onPress: handleCameraPickerPress,
    },
    {
      title: I18n.t(ext('imagePickerGalleryOption')),
      onPress: handleGalleryPickerPress,
    },
  ];

  function handleImagePickerResponse(response) {
    if (response.errorCode) {
      return Alert.alert(
        I18n.t(ext('imageSelectErrorMessage')),
        response.errorMessage,
      );
    }

    if (response.didCancel) {
      return hideImagePicker();
    }

    const { assets } = response;

    setProfilePicture(`data:image/jpeg;base64,${assets[0].base64}`);
    setProfilePictureData(assets[0].base64);

    return hideImagePicker();
  }

  // TODO: Add once phone update is possible
  const handlePhoneChanged = useCallback(
    phone => {
      setIsPhoneChanged(phone !== profile.phoneNumber);
      setPhoneNumber(phone);
    },
    [profile.phoneNumber],
  );

  const handleAddressSelected = useCallback(data => {
    goBack();
    setAddress(data.address);
    setGooglePlaceId(data.googlePlaceId);
    setLocation(data.location);
  }, []);

  const handleAddressPress = useCallback(
    () =>
      navigateTo(ext('SelectLocationScreen'), {
        onLocationSelected: handleAddressSelected,
      }),
    [handleAddressSelected],
  );

  const handleDobChanged = useCallback(date => {
    setDob(moment(date).toDate());
    setDobLabel(moment(date).format(DATE_LABEL_FORMAT));
  }, []);

  function handleVerificationSuccess() {
    return goBack();
  }

  function handleSubmit() {
    setLoading(true);
    Keyboard.dismiss();

    dispatch(
      setCustomerProfile({
        ...profile,
        phoneNumber,
        firstName,
        lastName,
        address,
        dob: moment(dob).format(DATE_VALUE_FORMAT),
        googlePlaceId,
        location,
      }),
    );

    if (isPhoneChanged) {
      setLoading(false);
      return dispatch(sendVerificationCode(phoneNumber))
        .then(() =>
          navigateTo(ext('PhoneVerificationScreen'), {
            onVerificationSuccess: handleVerificationSuccess,
          }),
        )
        .catch(e => handleError(e))
        .finally(() => setLoading(false));
    }

    const addresses = [{ googlePlaceId, address, location }];
    const defaultAddress = 0;

    return dispatch(createCustomer()).then(() =>
      dispatch(
        updateCustomerInfo({
          phone: phoneNumber,
          firstName,
          lastName,
          dob: moment(dob).format(DATE_VALUE_FORMAT),
          birthday: moment(dob).format(DATE_VALUE_FORMAT),
          addresses,
          defaultAddress,
          image: profilePictureData,
        }),
      )
        .then(() => goBack())
        .catch(e => handleError(e))
        .finally(() => setLoading(false)),
    );
  }

  function renderFooter() {
    return (
      <>
        <ActionSheet
          confirmOptions={pickerOptions}
          active={pickerActive}
          onDismiss={hideImagePicker}
          style={style.actionSheet}
        />
        <LoadingButton
          containerStyle={style.button}
          disabled={submitDisabled}
          label={I18n.t(ext('saveLabel'))}
          loading={loading}
          onPress={handleSubmit}
        />
      </>
    );
  }

  return (
    <KeyboardAwareContainer renderFooter={renderFooter}>
      <ProfileImage
        isEditable
        uri={profilePicture}
        onPress={() => setPickerActive(true)}
      />
      <FormInput
        label={I18n.t(ext('firstNameLabel'))}
        value={firstName}
        errorMessage={I18n.t(ext('nameErrorMessage'))}
        onChangeText={setFirstName}
        textContentType="name"
        labelColor={style.formInputLabelColor}
      />
      <FormInput
        label={I18n.t(ext('lastNameLabel'))}
        value={lastName}
        errorMessage={I18n.t(ext('nameErrorMessage'))}
        onChangeText={setLastName}
        labelColor={style.formInputLabelColor}
      />
      <FormInputButton
        onPress={handleAddressPress}
        value={address}
        label={I18n.t(ext('addressLabel'))}
        labelColor={style.formInputLabelColor}
      />
      <DatePicker
        label={I18n.t(ext('dobLabel'))}
        value={dob}
        textValue={dobLabel}
        onValueChanged={handleDobChanged}
        labelColor={style.formInputLabelColor}
      />
      {showErrorModal && (
        <ConfirmationModal
          visible={showErrorModal}
          description={errorMessage}
          onCancel={hideErrorModal}
        />
      )}
    </KeyboardAwareContainer>
  );
}

EditProfileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object,
};

EditProfileScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('EditProfileScreen'))(EditProfileScreen);
