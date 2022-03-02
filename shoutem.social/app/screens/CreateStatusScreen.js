import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, Keyboard as RNKeyboard, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Icon,
  Image,
  ImageBackground,
  Screen,
  View,
} from '@shoutem/ui';
import { authenticate } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { HeaderTextButton } from 'shoutem.navigation';
import { images } from '../assets';
import NewStatusFooter from '../components/NewStatusFooter';
import { ext, MAX_IMAGE_SIZE } from '../const';

export function CreateStatusScreen({ navigation, route, style }) {
  const {
    params: {
      user,
      placeholder,
      enablePhotoAttachments = true,
      statusMaxLength,
      onStatusCreated,
    },
  } = route;

  const dispatch = useDispatch();

  const [text, setText] = useState('');
  const [imageData, setImageData] = useState(undefined);

  const textInputRef = useRef(null);

  const debouncedHandleTextChange = _.debounce(setText, 250);

  const addNewStatus = useCallback(() => {
    if (text.length === 0) {
      Alert.alert(I18n.t(ext('blankPostWarning')));
    } else {
      dispatch(authenticate(() => onStatusCreated(text, imageData)));
    }
  }, [dispatch, imageData, onStatusCreated, text]);

  const headerRight = useCallback(
    props => {
      return (
        <HeaderTextButton
          title={I18n.t(ext('postCommentButton'))}
          onPress={addNewStatus}
          {...props}
        />
      );
    },
    [addNewStatus],
  );

  const cancelNewPost = useCallback(() => {
    if (text.length === 0 && !imageData) {
      return navigation.goBack();
    }

    return Alert.alert(
      I18n.t(ext('discardStatusAlertTitle')),
      I18n.t(ext('discardStatusAlertMessage')),
      [
        {
          text: I18n.t(ext('discardAlertButtonLabel')),
          style: 'destructive',
          onPress: navigation.goBack,
        },
        {
          text: I18n.t(ext('keepEditingButtonLabel')),
        },
      ],
    );
  }, [navigation, text.length, imageData]);

  const headerLeft = useCallback(
    props => {
      return (
        <HeaderTextButton
          {...props}
          title={I18n.t(ext('cancelHeaderButtonText'))}
          onPress={cancelNewPost}
        />
      );
    },
    [cancelNewPost],
  );

  useLayoutEffect(() => {
    const {
      params: { title },
    } = route;

    textInputRef?.current?.focus();

    navigation.setOptions({ title, headerLeft, headerRight });
  }, [headerLeft, headerRight, navigation, route]);

  const handleImageSelected = useCallback(response => {
    if (response.didCancel) {
      return;
    }

    if (response.errorCode) {
      Alert.alert(response.errorMessage);
    } else if (response.assets[0].fileSize > MAX_IMAGE_SIZE) {
      Alert.alert(I18n.t(ext('imageSizeWarning')));
    } else if (!response.didCancel) {
      setImageData(response.assets[0].base64);
    }
  }, []);

  function removeImage() {
    setImageData(undefined);
  }

  const profileImage = user?.profile?.image || user?.profile_image_url;

  const resolvedProfileAvatar = useMemo(
    () => (profileImage ? { uri: profileImage } : images.defaultProfileAvatar),
    [profileImage],
  );

  const attachmentSource = useMemo(
    () => ({
      uri: `data:image/png;base64,${imageData}`,
    }),
    [imageData],
  );

  return (
    <Screen styleName="paper md-gutter-top">
      <View styleName="flexible horizontal md-gutter-horizontal v-start">
        <Image
          styleName="small-avatar"
          source={resolvedProfileAvatar}
          style={style.profileAvatar}
        />
        <TextInput
          ref={textInputRef}
          style={style.textInput}
          multiline
          textAlignVertical="top"
          maxLength={statusMaxLength}
          placeholder={placeholder}
          onChangeText={debouncedHandleTextChange}
          returnKeyType="next"
          onSubmitEditing={RNKeyboard.dismiss}
        />
      </View>
      {imageData && (
        <View styleName="md-gutter-horizontal sm-gutter-bottom">
          <ImageBackground
            source={attachmentSource}
            styleName="large-banner"
            style={style.attachedImage}
          >
            <View
              styleName="fill-parent horizontal v-start h-end sm-gutter-right sm-gutter-top"
              style={style.overlay}
            >
              <Button styleName="tight clear" onPress={removeImage}>
                <Icon name="close" style={style.removeImageIcon} />
              </Button>
            </View>
          </ImageBackground>
        </View>
      )}
      <NewStatusFooter
        enablePhotoAttachments={enablePhotoAttachments}
        onImageSelected={handleImageSelected}
      />
    </Screen>
  );
}

CreateStatusScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  style: PropTypes.object,
};

CreateStatusScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('CreateStatusScreen'))(CreateStatusScreen);
