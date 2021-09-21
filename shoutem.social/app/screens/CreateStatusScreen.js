import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Alert,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Keyboard as RNKeyboard,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { connect } from 'react-redux';
import { authenticate } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import {
  requestPermissions,
  PERMISSION_TYPES,
  RESULTS,
} from 'shoutem.permissions';
import { getRouteParams, HeaderTextButton } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import {
  Screen,
  Row,
  Text,
  Image,
  ImageBackground,
  Button,
  View,
  Divider,
  Caption,
  Icon,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  ActionSheet,
} from '@shoutem/ui';
import { ext } from '../const';

const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSION_TYPES.IOS_CAMERA,
  default: PERMISSION_TYPES.ANDROID_CAMERA,
});

const IMAGE_PICKER_OPTIONS = {
  includeBase64: true,
  maxHeight: 1024,
  maxWidth: 1024,
  mediaType: 'photo',
};

export function CreateStatusScreen(props) {
  const { authenticate, style } = props;
  const {
    title,
    user,
    placeholder,
    enablePhotoAttachments = true,
    statusMaxLength,
    onStatusCreated,
  } = getRouteParams(props);

  const [text, setText] = useState('');
  const [numOfCharacters, setNumOfCharacters] = useState(statusMaxLength);
  const [pickerActive, setPickerActive] = useState(false);
  const [isPostEmpty, setIsPostEmpty] = useState(true);
  const [imageData, setImageData] = useState(undefined);

  const textInputRef = useRef(null);

  useEffect(() => {
    const { navigation } = props;
    navigation.setOptions({ title, headerRight });

    if (textInputRef && _.isFunction(textInputRef.current.focus())) {
      textInputRef.current.focus();
    }
  }, [text, isPostEmpty, imageData]);

  const handleTextChange = text => {
    setText(text);
    setNumOfCharacters(statusMaxLength - text.length);
    setIsPostEmpty(text.length === 0);
  };

  const addNewStatus = () => {
    if (isPostEmpty) {
      Alert.alert(I18n.t(ext('blankPostWarning')));
    } else {
      authenticate(() => onStatusCreated(text, imageData));
    }
  };

  const showPicker = () => {
    RNKeyboard.dismiss();
    setPickerActive(true);
  };

  const hidePicker = () => {
    setPickerActive(false);
  };

  const handleImageSelected = response => {
    if (response.errorCode) {
      Alert.alert(response.errorMessage);
    } else if (!response.didCancel) {
      setImageData(response.assets[0].base64);
      setPickerActive(false);
    }
  };

  const handleCameraSelectPress = () => {
    requestPermissions(CAMERA_PERMISSION).then(result => {
      if (result[CAMERA_PERMISSION] === RESULTS.GRANTED) {
        return launchCamera(IMAGE_PICKER_OPTIONS, handleImageSelected);
      }
    });
  };

  const removeImage = () => {
    setImageData(undefined);
  };

  const handleGallerySelectPress = () => {
    launchImageLibrary(IMAGE_PICKER_OPTIONS, handleImageSelected);
  };

  const headerRight = props => {
    return (
      <HeaderTextButton
        title={I18n.t(ext('postCommentButton'))}
        onPress={addNewStatus}
        {...props}
      />
    );
  };

  const renderHeader = () => {
    const name = _.get(user, 'profile.name');
    // eslint-disable-next-line camelcase
    const profile_image_url = _.get(user, 'profile.image');

    return (
      <View>
        <Row styleName="small">
          <Image styleName="small-avatar" source={{ uri: profile_image_url }} />
          <Text>{name}</Text>
        </Row>
      </View>
    );
  };

  const renderAttachedImage = () => {
    if (!imageData) {
      return null;
    }

    return (
      <View styleName="md-gutter-vertical">
        <ImageBackground
          source={{ uri: `data:image/png;base64,${imageData}` }}
          styleName="large-wide"
        >
          <View styleName="fill-parent horizontal v-start h-end sm-gutter-right sm-gutter-top">
            <Button styleName="tight clear" onPress={removeImage}>
              <Icon name="close" />
            </Button>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const renderTextInput = () => {
    return (
      <View styleName="flexible">
        <TextInput
          ref={textInputRef}
          style={style.textInput}
          multiline
          maxLength={statusMaxLength}
          placeholder={placeholder}
          onChangeText={handleTextChange}
          value={text}
          returnKeyType="next"
        />
        {renderAttachedImage()}
      </View>
    );
  };

  const renderFooter = () => {
    const keyboardOffset = Keyboard.calculateKeyboardOffset();
    const addPhotoButton = enablePhotoAttachments && (
      <TouchableOpacity onPress={showPicker}>
        <Icon name="take-a-photo" />
      </TouchableOpacity>
    );

    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={keyboardOffset}
      >
        <Divider styleName="line" />
        <View
          styleName="horizontal space-between md-gutter"
          style={style.footer}
        >
          {addPhotoButton}
          <Caption>
            {I18n.t(ext('charactersLeft'), { numOfCharacters })}
          </Caption>
        </View>
      </KeyboardAvoidingView>
    );
  };

  const pickerOptions = [
    {
      title: I18n.t(ext('imagePickerCameraOption')),
      onPress: handleCameraSelectPress,
    },
    {
      title: I18n.t(ext('imagePickerGalleryOption')),
      onPress: handleGallerySelectPress,
    },
  ];

  return (
    <Screen styleName="paper with-notch-padding">
      <Divider styleName="line" />
      {renderHeader()}
      <ScrollView>{renderTextInput()}</ScrollView>
      {renderFooter()}
      <ActionSheet
        confirmOptions={pickerOptions}
        active={pickerActive}
        onDismiss={hidePicker}
      />
    </Screen>
  );
}

CreateStatusScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  authenticate: PropTypes.func,
  style: PropTypes.object,
};

export default connect(null, { authenticate })(
  connectStyle(ext('CreateStatusScreen'))(CreateStatusScreen),
);
